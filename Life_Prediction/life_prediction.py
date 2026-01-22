import pandas as pd
import joblib
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from contextlib import asynccontextmanager

# --- CONFIGURATION ---
MODEL_PATH = r"D:\Code\DOG_project\dog_lifespan_app\joblib\dog_lifespan_model.joblib"
COLUMNS_PATH = r"D:\Code\DOG_project\dog_lifespan_app\joblib\model_columns.joblib"

# Global dictionary to hold artifacts
ml_models = {}

# --- LIFESPAN CONTEXT MANAGER (Modern Replacement for Startup) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    try:
        ml_models["model"] = joblib.load(MODEL_PATH)
        ml_models["columns"] = joblib.load(COLUMNS_PATH)
        print("✅ Model and column definitions loaded successfully.")
    except Exception as e:
        print(f"❌ Error loading artifacts: {e}")
        print("Please run 'train_model.py' first.")
    
    yield  # Control is yielded to the application here
    
    # Clean up resources (if needed) when app shuts down
    ml_models.clear()

app = FastAPI(
    title="Dog Lifespan Prediction API",
    description="API to predict remaining lifespan based on medical and lifestyle features.",
    lifespan=lifespan  # Register the lifespan handler
)

# --- INPUT SCHEMA ---
class DogFeatures(BaseModel):
    Age_at_Condition: float = Field(..., example=7.0)
    dog_insurance: bool = Field(..., example=False)
    hs_condition: str = Field(..., example="Blindness")
    dd_spayed_or_neutered: str = Field(..., example="spayed")
    pa_avg_daily_active_hours: float = Field(..., example=1.5)
    dd_breed_pure_or_mixed: str = Field(..., example="Purebred")
    
    # Optional fields
    dd_breed_pure: Optional[str] = Field(None, example="Labrador Retriever")
    dd_breed_mixed_primary: Optional[str] = None
    dd_breed_mixed_secondary: Optional[str] = None
    df_primary_diet_component: Optional[str] = Field(None, example="Commercially prepared dry food (kibble)")
    mp_vaccination_status: Optional[int] = 1
    weight_lbs: float = Field(..., example=50.5)
    pa_avg_activity_intensity: Optional[str] = Field(None, example="Moderate")
    lifestyle_01: Optional[str] = None
    lifestyle_02: Optional[str] = None
    lifestyle_03: Optional[str] = None

# --- PREDICTION ENDPOINT ---
@app.post("/lifespan/predict", summary="Predict Dog Remaining Lifespan")
def predict_lifespan(dog: DogFeatures):
    if "model" not in ml_models or "columns" not in ml_models:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # A. Convert to DataFrame
        input_data = dog.dict()
        df = pd.DataFrame([input_data])

        # B. Handle Typo (from your training logic)
        model_cols = ml_models["columns"]
        if 'mp_vaccination_status' in df.columns:
             if 'mp_vacciNaNtion_status' in model_cols:
                 df.rename(columns={'mp_vaccination_status': 'mp_vacciNaNtion_status'}, inplace=True)

        # C. One-Hot Encoding
        df_encoded = pd.get_dummies(df)

        # D. ALIGNMENT: Force input to match model structure exactly
        # This adds missing columns (with 0) and removes extra ones
        df_final = df_encoded.reindex(columns=model_cols, fill_value=0)

        # E. Cleanup
        df_final = df_final.fillna(0)

        # F. Predict
        prediction = ml_models["model"].predict(df_final)
        
        return {
            "predicted_remaining_lifespan": round(float(prediction[0]), 2),
            "unit": "years",
            "status": "success"
        }

    except Exception as e:
        # It's good practice to log the full error for the developer
        import traceback
        traceback.print_exc() 
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)