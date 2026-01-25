# utils.py

def map_age_to_life_stage(age: float) -> str:
    """
    Maps numerical age to a standardized life stage string based on defined intervals.
    - 0-1 year: Puppy
    - 1-3 years: Young adult
    - 3-7 years: Adult
    - 7+ years: Senior
    """
    if age < 1: return "Puppy (0-1 year)"
    elif 1 <= age < 3: return "Young adult (1-3 years)"
    elif 3 <= age < 7: return "Adult (3-7 years)"
    else: return "Senior (7+ years)"

def map_weight_to_class(weight_kg: float) -> str:
    """
    Categorizes weight into standardized 5kg bins for the disease prediction model.
    """
    if weight_kg < 5: return "Less than 5 kg"
    elif 5 <= weight_kg < 10: return "5-9.9 kg"
    elif 10 <= weight_kg < 15: return "10-14.9 kg"
    elif 15 <= weight_kg < 25: return "15-24.9 kg"
    elif 25 <= weight_kg < 35: return "25-34.9 kg"
    else: return "35 kg or more"

def normalize_diet_component(raw_diet: str) -> str:
    """
    Standardizes diet input strings. Maps "Freeze-dried" and "Other" to "Commercial kibble"
    as per requirements.
    """
    diet = raw_diet.lower().strip()
    mapping = {
        "commercial kibble": "Commercial kibble",
        "commercial wet": "Commercial wet",
        "home cooked": "Home cooked",
        "raw": "Raw",
        "freeze-dried": "Commercial kibble",
        "other": "Commercial kibble"
    }
    return mapping.get(diet, "Commercial kibble")


def normalize_diet_component_lifespan(raw_diet: str) -> str:
    """
    Strict mapping for the LIFESPAN model.
    CRITICAL: Preserves specific leading/trailing spaces required by One-Hot Encoding.
    """
    diet = raw_diet.lower().strip()

    if diet == "commercial kibble":
        return " Commercially prepared dry food (kibble)  "  # 1 leading, 2 trailing spaces
    elif diet == "commercial wet":
        return "  Commercially prepared canned food  "  # 2 leading, 2 trailing spaces
    elif diet == "freeze-dried":
        return "  Commercially prepared freeze-dried food  "  # 2 leading, 2 trailing spaces
    elif diet == "home cooked":
        return "  Home prepared cooked diet  "  # 2 leading, 2 trailing spaces
    elif diet == "raw":
        return "  Home prepared raw diet  "  # 2 leading, 2 trailing spaces
    else:
        # Default for "Other"
        return "  Other"  # 2 leading spaces


def map_activity_intensity(intensity: str) -> str:
    """
    Maps frontend activity intensity to the model's expected format.
    - Light -> Low (walking)
    - Moderate -> Moderate (jogging)
    - Intense -> Vigorous (sprinting)
    """
    val = intensity.lower().strip()

    if val == "light":
        return "Low (walking)"
    elif val == "moderate":
        return "Moderate (jogging)"
    elif val == "intense":
        return "Vigorous (sprinting)"
    else:
        # Default fallback for unknown values
        return ""

def get_risk_interpretation(score: float) -> str:
    """Converts a 0-100 risk score into a qualitative risk level."""
    if score < 20: return "Low"
    elif score < 40: return "Low-Moderate"
    elif score < 60: return "Moderate"
    elif score < 80: return "Moderate-High"
    else: return "High"

def get_reliability_rating(auc_score: float) -> str:
    """Converts the model's AUC score into a reliability rating."""
    if auc_score >= 0.70: return "High"
    elif auc_score >= 0.65: return "Good"
    elif auc_score >= 0.60: return "Moderate"
    else: return "Low"

def get_reliability_explanation(auc_score: float, disease: str) -> str:
    """Generates a detailed text explanation of the prediction's reliability based on AUC."""
    rating = get_reliability_rating(auc_score)
    explanations = {
        "High": f"Strong predictive model (AUC {auc_score:.4f}). This {disease} prediction is based on well-validated features.",
        "Good": f"Good predictive model (AUC {auc_score:.4f}). This {disease} prediction is reasonably reliable.",
        "Moderate": f"Moderate predictive model (AUC {auc_score:.4f}). This {disease} prediction should be considered alongside other factors.",
        "Low": f"Limited predictive model (AUC {auc_score:.4f}). This {disease} prediction has lower reliability; consult your veterinarian."
    }
    return explanations.get(rating, "Reliability assessment pending.")

def get_recommendation(disease: str, risk_score: float) -> str:
    """Provides actionable veterinary advice based on the calculated risk level."""
    risk_level = get_risk_interpretation(risk_score)
    recommendations = {
        "low": "Continue regular wellness exams and preventive care.",
        "low-moderate": "Monitor for early signs and maintain preventive care.",
        "moderate": "Schedule veterinary consultation for thorough evaluation.",
        "moderate-high": "Consult with veterinarian soon for comprehensive assessment.",
        "high": "Schedule urgent veterinary consultation and testing."
    }
    return recommendations.get(risk_level.lower().replace(" ", "-"), "Consult your veterinarian.")