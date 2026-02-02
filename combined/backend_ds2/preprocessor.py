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
        'Estimated_Age_Years_at_HLES': float(age),
        'Sex_Class_at_HLES': str(data.sex),
        'Breed_Status': "Purebred" if str(data.breedState).lower() == "pure" else "Mixed Breed",
        'Weight_Class_5KGBin_at_HLES': map_weight_to_class(data.weight),
        'LifeStage_Class_at_HLES': map_age_to_life_stage(age),
        'pa_activity_level': str(data.activityLevel),
        'pa_avg_daily_active_hours': float(data.dailyActiveHours),
        'pa_avg_activity_intensity': str(data.activityIntensity),
        'df_primary_diet_component': normalize_diet_component(data.primaryDiet),
        'df_appetite': str(data.appetiteLevel),
        'dd_spayed_or_neutered': "spayed" if str(data.spayedNeutered).lower() == "yes" else "neutered",
        'mp_vaccination_status': str(data.vaccinationStatus),
        'db_fear_level_loud_noises': str(data.fearOfNoises),
        'db_aggression_level_on_leash_unknown_dog': str(data.aggressionOnLeash),
        'de_home_type': str(data.homeType),
        'de_home_area_type': str(data.homeArea),
        'de_lead_present': str(data.leadPresent),
        'od_annual_income_range_usd': str(data.annualIncome),
        'cv_population_density': str(data.homeArea),  # Proxy using homeArea
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


# preprocessor.py

def preprocess_detailed_disease(data, age, encoders, features_list):
    """
    Prepares data for the 67-feature Precision Disease prediction model.
    Uses explicit type conversion (str/float) to resolve StringDtype errors.
    """
    feature_dict = {
        # --- Basic Features (Explicit Conversion) ---
        'Estimated_Age_Years_at_HLES': float(age),
        'Sex_Class_at_HLES': str(data.sex),
        'Breed_Status': str("Purebred" if str(data.breedState).lower() == "pure" else "Mixed Breed"),
        'Weight_Class_5KGBin_at_HLES': str(map_weight_to_class(data.weight)),
        'LifeStage_Class_at_HLES': str(map_age_to_life_stage(age)),
        'pa_activity_level': str(data.activityLevel),
        'pa_avg_daily_active_hours': float(data.dailyActiveHours),
        'pa_avg_activity_intensity': str(data.activityIntensity),
        'df_primary_diet_component': str(normalize_diet_component(data.primaryDiet)),
        'df_appetite': str(data.appetiteLevel),
        'dd_spayed_or_neutered': str("spayed" if str(data.spayedNeutered).lower() == "yes" else "neutered"),
        'mp_vaccination_status': str(data.vaccinationStatus),
        'db_fear_level_loud_noises': str(data.fearOfNoises),
        'db_aggression_level_on_leash_unknown_dog': str(data.aggressionOnLeash),
        'de_home_type': str(data.homeType),
        'de_home_area_type': str(data.homeArea),
        'de_lead_present': str(data.leadPresent),
        'od_annual_income_range_usd': str(data.annualIncome),
        'cv_population_density': str(data.homeArea),

        # --- Detailed Analysis Features (Explicit Conversion) ---
        'pa_moderate_weather_daily_hours_outside': float(data.pa_moderate_weather_daily_hours_outside),
        'pa_hot_weather_months_per_year': float(data.pa_hot_weather_months_per_year),
        'pa_cold_weather_months_per_year': float(data.pa_cold_weather_months_per_year),
        'df_diet_consistency': str(data.df_diet_consistency),
        'df_appetite_change_last_year': str(data.df_appetite_change_last_year),
        'df_ever_overweight': str(data.df_ever_overweight),
        'df_daily_supplements': str(data.df_daily_supplements),
        'df_daily_supplements_glucosamine': str(data.df_daily_supplements_glucosamine),
        'df_daily_supplements_omega3': str(data.df_daily_supplements_omega3),
        'db_fear_level_unknown_situations': str(data.db_fear_level_unknown_situations),
        'db_left_alone_barking_frequency': str(data.db_left_alone_barking_frequency),
        'db_attention_seeking_follows_humans_frequency': str(data.db_attention_seeking_follows_humans_frequency),
        'mp_dental_brushing_frequency': str(data.mp_dental_brushing_frequency),
        'mp_flea_and_tick_treatment': str(data.mp_flea_and_tick_treatment),
        'mp_heartworm_preventative': str(data.mp_heartworm_preventative),
        'de_nighttime_sleep_avg_hours': float(data.de_nighttime_sleep_avg_hours),
        'de_daytime_sleep_avg_hours': float(data.de_daytime_sleep_avg_hours),
        'de_drinking_water_source': str(data.de_drinking_water_source),
        'de_radon_present': str(data.de_radon_present),
        'de_central_air_conditioning_present': str(data.de_central_air_conditioning_present),
        'de_stairs_in_home': str(data.de_stairs_in_home),
        'oc_household_person_count': float(data.oc_household_person_count),
        'oc_household_child_count': float(data.oc_household_child_count),
        'de_other_present_animals_dogs': float(data.de_other_present_animals_dogs),

        'pa_moderate_weather_sun_exposure_level': str("Moderate"),
        'df_ever_underweight': str("No"),
        'df_weight_change_last_year': str("Stable"),
        'dd_spay_or_neuter_age': float(0.5),  # 假设半岁左右
        'dd_estrous_cycle_count': float(0),
        'dd_litter_count': float(0),
        'db_left_alone_scratching_frequency': str("Never"),
        'de_drinking_water_is_filtered': str(
            "Yes" if str(data.de_drinking_water_source).lower() == "filtered" else "No"),
        'de_asbestos_present': str("No"),
        'de_wood_fireplace_present': str("No"),
        'de_gas_fireplace_present': str("No"),
        'de_second_hand_smoke_hours_per_day': float(0.0),
        'de_property_weed_control_frequency': str("Never"),
        'de_property_pest_control_frequency': str("Never"),
        'de_eats_grass_frequency': str("Rarely"),
        'de_eats_feces': str("No"),
        'de_interacts_with_neighborhood_animals': str("Yes"),
        'de_dogpark': str("Yes"),
        'de_interacts_with_neighborhood_humans': str("Yes"),
        'dd_acquired_source': str("Shelter"),
        'dd_insurance': str(data.insurance),
        'od_max_education': str("Bachelor's degree"),
        'cv_median_income': str(data.annualIncome),
        'cslb_score': float(50.0)  # 认知健康评分中位数
    }

    # Create DataFrame from explicitly typed dictionary
    df = pd.DataFrame([feature_dict])

    # 1. Apply Label Encoders
    for col in df.columns:
        if col in encoders:
            try:
                # Ensure the value is treated as a plain Python string
                val = str(df[col].iloc[0]).strip()
                df[col] = float(encoders[col].transform([val])[0])
            except:
                df[col] = 0.0

    # 2. CRITICAL FIX: Break the StringDtype lock by converting to standard object first
    for col in df.columns:
        # Converting to 'object' reverts Pandas specialized strings to standard Python strings
        df[col] = pd.to_numeric(df[col].astype(object), errors='coerce').fillna(0.0)

    # 3. Return the specific features as standard floats
    return df[features_list].astype(float)