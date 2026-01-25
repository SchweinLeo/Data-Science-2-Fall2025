# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib, uvicorn, os, pickle
from contextlib import asynccontextmanager
from pathlib import Path

# Import Schemas
from schemas import DogHealthData

# Import custom processing modules
from preprocessor import preprocess_lifespan, preprocess_basic_disease
from optimizer import optimize_lifespan  # <--- New Import
from utils import (
    get_risk_interpretation,
    get_reliability_rating,
    get_reliability_explanation,
    get_recommendation
)

# --- Configuration & Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH_LIFESPAN = os.path.join(BASE_DIR, "models", "lifespan", "dog_lifespan_model.joblib")
COLUMNS_PATH_LIFESPAN = os.path.join(BASE_DIR, "models", "lifespan", "model_columns.joblib")
MODEL_DIR_BASIC = Path("models/saved_models_19feat")

DISEASES = ['orthopedic', 'dermatological', 'cardiac', 'ear', 'urinary']
AUC_SCORES_BASIC = {
    'orthopedic': 0.6676, 'dermatological': 0.5814, 'cardiac': 0.6706,
    'ear': 0.5836, 'urinary': 0.7064
}

# Global dictionary
ml_models = {}
disease_models_dict = {}


def load_disease_models():
    """Loads disease prediction classifiers."""
    models_basic = {d: pickle.load(open(MODEL_DIR_BASIC / f"target_{d}_19feat.pkl", 'rb')) for d in DISEASES}
    return {
        'models_basic': models_basic,
        'scaler_basic': pickle.load(open(MODEL_DIR_BASIC / "scaler_19feat.pkl", 'rb')),
        'features_19': pickle.load(open(MODEL_DIR_BASIC / "features_19feat.pkl", 'rb')),
        'encoders_basic': pickle.load(open(MODEL_DIR_BASIC / "encoders_19feat.pkl", 'rb')),
    }


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/Shutdown logic."""
    try:
        if os.path.exists(MODEL_PATH_LIFESPAN):
            ml_models["lifespan"] = joblib.load(MODEL_PATH_LIFESPAN)
            ml_models["columns"] = joblib.load(COLUMNS_PATH_LIFESPAN)
            print("✅ Lifespan prediction model loaded.")

        global disease_models_dict
        disease_models_dict = load_disease_models()
        print("✅ Disease risk models loaded.")
    except Exception as e:
        print(f"❌ Startup Error: {e}")
    yield
    ml_models.clear()
    disease_models_dict.clear()


app = FastAPI(title="Dog Health Prediction API", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"])


@app.post("/predict")
async def predict_health(dog: DogHealthData):
    """Main endpoint with Optimization Logic."""
    if "lifespan" not in ml_models or not disease_models_dict:
        raise HTTPException(status_code=500, detail="Models not loaded on server.")

    try:
        # 1. Process and Predict Lifespan (Baseline)
        df_l, age = preprocess_lifespan(dog, ml_models["columns"])
        pred_l = ml_models["lifespan"].predict(df_l)[0]

        # 2. RUN OPTIMIZATION (New Feature)
        optimization_result = optimize_lifespan(dog, ml_models["lifespan"], ml_models["columns"])

        # 3. Process and Predict Disease Risks
        df_b = preprocess_basic_disease(dog, age, disease_models_dict['encoders_basic'],
                                        disease_models_dict['features_19'])
        X_scaled = disease_models_dict['scaler_basic'].transform(df_b)

        predictions_list = []
        risk_values = []

        for d in DISEASES:
            model = disease_models_dict['models_basic'][d]
            proba = model.predict_proba(X_scaled)[0]
            risk_score = round(proba[1] * 100, 1)
            risk_values.append(proba[1])
            auc = AUC_SCORES_BASIC[d]

            predictions_list.append({
                "disease": d.upper(),
                "risk_score": risk_score,
                "confidence": f"{round(max(proba) * 100, 1)}%",
                "interpretation": get_risk_interpretation(risk_score),
                "recommendation": get_recommendation(d, risk_score),
                "reliability": get_reliability_rating(auc),
                "auc_score": round(auc, 4),
                "reliability_explanation": get_reliability_explanation(auc, d)
            })

        avg_risk = (sum(risk_values) / len(risk_values)) * 100
        high_risk_flag = any(p['risk_score'] >= 60 for p in predictions_list)
        summary = "⚠️ High risk detected. Consultation advised." if high_risk_flag else "✓ Health profile looks stable."

        return {
            "dog_profile": {"name": dog.dogName, "age": age, "sex": dog.sex, "weight": dog.weight},
            "lifespan_prediction": {
                "remaining_years": round(float(pred_l), 2),
                "total_estimated_years": round(age + float(pred_l), 2)
            },
            # Add optimization results to the response
            "lifespan_optimization": optimization_result,

            "predictions": predictions_list,
            "average_risk": round(avg_risk, 1),
            "summary": summary,
            "honesty_level": "100% - Based only on provided information",
            "status": "success"
        }
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)