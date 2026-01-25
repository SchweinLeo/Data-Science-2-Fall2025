# schemas.py
from pydantic import BaseModel
from typing import Optional

class DogHealthData(BaseModel):
    """
    Shared data model for dog health profile.
    Moved here to allow access from both main.py and optimizer.py.
    """
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