# preprocessor.py
import pandas as pd
import numpy as np
from datetime import datetime
from utils import (
    map_age_to_life_stage,
    map_weight_to_class,
    normalize_diet_component,
    normalize_diet_component_lifespan,
    map_activity_intensity,
)

# Map month names to integers for age calculation
MONTH_MAP = {
    "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
    "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
}


def preprocess_lifespan(data, model_cols):
    """
    Prepares data for the Lifespan prediction model using One-Hot encoding alignment.
    """
    today = datetime.now()
    birth_month_num = MONTH_MAP.get(data.birthMonth, 1)
    total_months = (today.year - data.birthYear) * 12 + (today.month - birth_month_num)
    age = max(0.0, round(total_months / 12.0, 1))

    # Construct the raw feature dictionary with lifespan-specific keys
    raw_dict = {
        "Age_at_Condition": age,
        "dog_insurance": data.insurance.lower() == "yes",
        "hs_condition": data.disease,
        "dd_spayed_or_neutered": "spayed" if data.spayedNeutered.lower() == "yes" else "neutered",
        "pa_avg_daily_active_hours": data.dailyActiveHours,
        "dd_breed_pure_or_mixed": "Purebred" if data.breedState.lower() == "pure" else "Mixed Breed",
        "dd_breed_pure": data.breed,
        "dd_breed_mixed_primary": data.primaryBreed,
        "dd_breed_mixed_secondary": data.secondaryBreed,
        "df_primary_diet_component": normalize_diet_component_lifespan(data.primaryDiet),
        "mp_vaccination_status": 1 if data.vaccinationStatus.lower() == "current" else 0,
        "weight_lbs": data.weight * 2.20462,
        "pa_avg_activity_intensity": map_activity_intensity(data.activityIntensity),
    }
    df = pd.DataFrame([raw_dict])

    # Handle specific naming typos found in the saved model columns
    if 'mp_vacciNaNtion_status' in model_cols:
        df.rename(columns={'mp_vaccination_status': 'mp_vacciNaNtion_status'}, inplace=True)

    # One-Hot Encode and reindex to match training column order
    df_encoded = pd.get_dummies(df)
    return df_encoded.reindex(columns=model_cols, fill_value=0), age


def preprocess_basic_disease(data, age, encoders, features_list):
    """
    Prepares data for the 19-feature Disease prediction model using Label Encoding.
    """
    feature_dict = {
        'Estimated_Age_Years_at_HLES': age,
        'Sex_Class_at_HLES': data.sex,
        'Breed_Status': "Purebred" if data.breedState.lower() == "pure" else "Mixed Breed",
        'Weight_Class_5KGBin_at_HLES': map_weight_to_class(data.weight),
        'LifeStage_Class_at_HLES': map_age_to_life_stage(age),
        'pa_activity_level': data.activityLevel,
        'pa_avg_daily_active_hours': data.dailyActiveHours,
        'pa_avg_activity_intensity': data.activityIntensity,
        'df_primary_diet_component': normalize_diet_component(data.primaryDiet),
        'df_appetite': data.appetiteLevel,
        'dd_spayed_or_neutered': "spayed" if data.spayedNeutered.lower() == "yes" else "neutered",
        'mp_vaccination_status': data.vaccinationStatus,
        'db_fear_level_loud_noises': data.fearOfNoises,
        'db_aggression_level_on_leash_unknown_dog': data.aggressionOnLeash,
        'de_home_type': data.homeType,
        'de_home_area_type': data.homeArea,
        'de_lead_present': data.leadPresent,
        'od_annual_income_range_usd': data.annualIncome,
        'cv_population_density': data.homeArea,  # Proxy using homeArea
    }
    df = pd.DataFrame([feature_dict])

    # Apply saved Label Encoders to categorical columns
    encoded_cols = ['Sex_Class_at_HLES', 'Breed_Status', 'Weight_Class_5KGBin_at_HLES',
                    'LifeStage_Class_at_HLES', 'df_primary_diet_component', 'df_appetite']
    for col in encoded_cols:
        if col in encoders:
            try:
                val = str(df[col].iloc[0]).strip()
                df[col] = float(encoders[col].transform([val])[0])
            except:
                df[col] = 0.0  # Default fallback for unseen labels

    # Ensure all remaining columns are numeric
    for col in df.columns:
        if col not in encoded_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)

    return df.astype(float)[features_list]