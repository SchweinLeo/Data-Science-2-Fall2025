# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib, uvicorn, os, pickle
from contextlib import asynccontextmanager
from pathlib import Path

# Import request/response schemas (Pydantic models)
from schemas import DogHealthData, DetailedDogHealthData

# Import custom preprocessing modules for different prediction pipelines
from preprocessor import (
    preprocess_lifespan,
    preprocess_basic_disease,
    preprocess_detailed_disease,
)

# Import optimization logic for lifespan improvement suggestions
from optimizer import optimize_lifespan

# Import helper functions for interpreting and formatting outputs
from utils import (
    get_risk_interpretation,
    get_reliability_rating,
    get_reliability_explanation,
    get_recommendation,
)

# --- Configuration & Paths ---
# Resolve the directory where this file is located (used to build stable model paths)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Lifespan model paths
MODEL_PATH_LIFESPAN = os.path.join(BASE_DIR, "models", "lifespan", "dog_lifespan_model.joblib")
COLUMNS_PATH_LIFESPAN = os.path.join(BASE_DIR, "models", "lifespan", "model_columns.joblib")

# Disease model directories
MODEL_DIR_BASIC = Path("models/saved_models_19feat")   # Basic models using 19 features
MODEL_DIR_DETAILED = Path("models/saved_models")       # Advanced models using 67 features

# Supported disease categories
DISEASES = ["orthopedic", "dermatological", "cardiac", "ear", "urinary"]

# Global containers for persisted models/metadata
ml_models = {}
disease_models_dict = {}   # Stores 19-feature models and preprocessors
detailed_models_dict = {}  # Stores 67-feature models and preprocessors


def load_disease_models():
    """Load basic disease classifiers (19-feature pipeline) plus preprocessing assets."""
    models_basic = {
        d: pickle.load(open(MODEL_DIR_BASIC / f"target_{d}_19feat.pkl", "rb"))
        for d in DISEASES
    }
    return {
        "models": models_basic,
        "scaler": pickle.load(open(MODEL_DIR_BASIC / "scaler_19feat.pkl", "rb")),
        "features": pickle.load(open(MODEL_DIR_BASIC / "features_19feat.pkl", "rb")),
        "encoders": pickle.load(open(MODEL_DIR_BASIC / "encoders_19feat.pkl", "rb")),
    }


def load_detailed_models():
    """Load advanced disease classifiers (67-feature pipeline) plus preprocessing assets."""
    # Advanced models use the naming format: {disease}_logistic.pkl
    models_detailed = {
        d: pickle.load(open(MODEL_DIR_DETAILED / f"{d}_logistic.pkl", "rb"))
        for d in DISEASES
    }
    return {
        "models": models_detailed,
        "scaler": pickle.load(open(MODEL_DIR_DETAILED / "feature_scaler.pkl", "rb")),
        "features": pickle.load(open(MODEL_DIR_DETAILED / "features_list.pkl", "rb")),
        "encoders": pickle.load(open(MODEL_DIR_DETAILED / "label_encoders.pkl", "rb")),
    }


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan handler:
    - On startup: load all ML models and preprocessing artifacts into memory.
    - On shutdown: clear caches to free memory.
    """
    try:
        # Load lifespan regression model and its expected input column order
        if os.path.exists(MODEL_PATH_LIFESPAN):
            ml_models["lifespan"] = joblib.load(MODEL_PATH_LIFESPAN)
            ml_models["columns"] = joblib.load(COLUMNS_PATH_LIFESPAN)
            print("✅ Lifespan prediction model loaded.")

        # Load basic disease risk models (19 features)
        global disease_models_dict
        disease_models_dict = load_disease_models()
        print("✅ Basic disease risk models (19feat) loaded.")

        # Load advanced disease risk models (67 features)
        global detailed_models_dict
        detailed_models_dict = load_detailed_models()
        print("✅ Detailed disease risk models (67feat) loaded.")

    except Exception as e:
        print(f"❌ Startup Error: {e}")

    yield

    # Cleanup on shutdown
    ml_models.clear()
    disease_models_dict.clear()
    detailed_models_dict.clear()


# Create FastAPI app and attach lifespan lifecycle logic
app = FastAPI(title="Dog Health Prediction API", lifespan=lifespan)

# Enable CORS for all origins (use a restricted list in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
async def predict_health(dog: DogHealthData):
    """Basic endpoint: runs lifespan + 19-feature disease risk assessment."""
    if "lifespan" not in ml_models or not disease_models_dict:
        raise HTTPException(status_code=500, detail="Models not loaded on server.")

    try:
        # 1) Lifespan prediction
        df_l, age = preprocess_lifespan(dog, ml_models["columns"])
        pred_l = ml_models["lifespan"].predict(df_l)[0]
        optimization_result = optimize_lifespan(dog, ml_models["lifespan"], ml_models["columns"])

        # 2) Disease risk prediction (basic 19-feature pipeline)
        df_b = preprocess_basic_disease(
            dog,
            age,
            disease_models_dict["encoders"],
            disease_models_dict["features"],
        )
        X_scaled = disease_models_dict["scaler"].transform(df_b)

        predictions_list = []
        risk_values = []

        for d in DISEASES:
            model = disease_models_dict["models"][d]
            proba = model.predict_proba(X_scaled)[0]
            risk_score = round(proba[1] * 100, 1)
            risk_values.append(proba[1])

            predictions_list.append(
                {
                    "disease": d.upper(),
                    "risk_score": risk_score,
                    "confidence": f"{round(max(proba) * 100, 1)}%",
                    "interpretation": get_risk_interpretation(risk_score),
                    "recommendation": get_recommendation(d, risk_score),
                    "status": "basic_analysis",
                }
            )

        # Average risk score across all disease categories (basic models)
        avg_risk = (sum(risk_values) / len(risk_values)) * 100

        return {
            "dog_profile": {
                "name": dog.dogName,
                "age": age,
                "sex": dog.sex,
                "weight": dog.weight,
            },
            "lifespan_prediction": {
                "remaining_years": round(float(pred_l), 2),
                "total_estimated_years": round(age + float(pred_l), 2),
            },
            "lifespan_optimization": optimization_result,
            "predictions": predictions_list,
            "average_risk": round(avg_risk, 1),
            "summary": "Health profile looks stable."
            if avg_risk < 60
            else "⚠️ Consultation advised.",
            "honesty_level": "Basic 19-factor assessment",
            "status": "success",
        }

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/predict_detailed")
async def predict_health_detailed(dog: DetailedDogHealthData):
    """
    Precision endpoint:
    - Runs both basic (19-feature) and advanced (67-feature) disease risk models.
    - Returns combined predictions plus separate average risk scores.
    """
    if "lifespan" not in ml_models or not detailed_models_dict or not disease_models_dict:
        raise HTTPException(status_code=500, detail="All models must be loaded.")

    try:
        # 0) Shared preprocessing (age extraction + lifespan input formatting)
        df_l, age = preprocess_lifespan(dog, ml_models["columns"])

        # 1) Basic model prediction (19-feature)
        df_b = preprocess_basic_disease(
            dog,
            age,
            disease_models_dict["encoders"],
            disease_models_dict["features"],
        )
        X_scaled_b = disease_models_dict["scaler"].transform(df_b)

        basic_results = []
        basic_risk_values = []

        for d in DISEASES:
            model = disease_models_dict["models"][d]
            proba = model.predict_proba(X_scaled_b)[0]
            risk_score = round(proba[1] * 100, 1)
            basic_risk_values.append(proba[1])

            basic_results.append(
                {
                    "disease": d.upper(),
                    "risk_score": risk_score,
                    "model_type": "basic",
                    "interpretation": get_risk_interpretation(risk_score),
                    "recommendation": get_recommendation(d, risk_score),
                }
            )

        # 2) Advanced model prediction (67-feature)
        df_d = preprocess_detailed_disease(
            dog,
            age,
            detailed_models_dict["encoders"],
            detailed_models_dict["features"],
        )
        X_scaled_d = detailed_models_dict["scaler"].transform(df_d)

        advanced_results = []
        advanced_risk_values = []

        for d in DISEASES:
            model = detailed_models_dict["models"][d]
            proba = model.predict_proba(X_scaled_d)[0]
            risk_score = round(proba[1] * 100, 1)
            advanced_risk_values.append(proba[1])

            advanced_results.append(
                {
                    "disease": d.upper(),
                    "risk_score": risk_score,
                    "model_type": "advanced",
                    "interpretation": get_risk_interpretation(risk_score),
                    "recommendation": get_recommendation(d, risk_score),
                }
            )

        # 3) Compute average risk for each model family
        avg_risk_basic = round((sum(basic_risk_values) / len(basic_risk_values)) * 100, 1)
        avg_risk_adv = round((sum(advanced_risk_values) / len(advanced_risk_values)) * 100, 1)

        return {
            "dog_profile": {"name": dog.dogName, "age": age},
            "predictions": basic_results + advanced_results,
            "average_risk": avg_risk_adv,  # Default to the advanced pipeline average
            "basic_average_risk": avg_risk_basic,
            "advanced_average_risk": avg_risk_adv,
            "honesty_level": "High-Precision Dual Model Sync",
            "status": "success",
        }

    except Exception as e:
        print(f"Detailed Prediction Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    # Local development entry point
    uvicorn.run(app, host="0.0.0.0", port=8000)
