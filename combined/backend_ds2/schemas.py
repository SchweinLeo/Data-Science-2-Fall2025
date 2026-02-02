# schemas.py
from pydantic import BaseModel
from typing import Optional

class DogHealthData(BaseModel):

    dogName: str
    birthMonth: str
    birthYear: int
    sex: str
    weight: float
    breedState: str
    breed: Optional[str] = None
    primaryBreed: Optional[str] = None
    secondaryBreed: Optional[str] = None
    dailyActiveHours: float
    activityIntensity: str
    activityLevel: str
    primaryDiet: str
    appetiteLevel: str
    fearOfNoises: str
    aggressionOnLeash: str
    homeType: str
    homeArea: str
    leadPresent: str
    annualIncome: str
    spayedNeutered: str
    vaccinationStatus: str
    insurance: str
    disease: Optional[str] = "Dental calculus (yellow build-up on teeth)"

class DetailedDogHealthData(DogHealthData):

    pa_moderate_weather_daily_hours_outside: float
    pa_hot_weather_months_per_year: float
    pa_cold_weather_months_per_year: float
    df_diet_consistency: str
    df_appetite_change_last_year: str
    df_ever_overweight: str
    df_daily_supplements: str
    df_daily_supplements_glucosamine: str
    df_daily_supplements_omega3: str
    db_fear_level_unknown_situations: str
    db_left_alone_barking_frequency: str
    db_attention_seeking_follows_humans_frequency: str
    mp_dental_brushing_frequency: str
    mp_flea_and_tick_treatment: str
    mp_heartworm_preventative: str
    de_nighttime_sleep_avg_hours: float
    de_daytime_sleep_avg_hours: float
    de_drinking_water_source: str
    de_radon_present: str
    de_central_air_conditioning_present: str
    de_stairs_in_home: str
    oc_household_person_count: int
    oc_household_child_count: int
    de_other_present_animals_dogs: int