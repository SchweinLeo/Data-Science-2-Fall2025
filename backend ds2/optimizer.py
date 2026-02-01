# optimizer.py
import itertools
import pandas as pd
from schemas import DogHealthData
from preprocessor import preprocess_lifespan


def optimize_lifespan(original_data: DogHealthData, model, model_cols):
    """
    Iterates through modifiable lifestyle factors to find the combination
    that yields the maximum predicted lifespan.
    """

    # 1. Define candidates for optimization

    # Insurance: If currently 'No', try 'Yes'.
    insurance_opts = [original_data.insurance]
    if original_data.insurance.lower() == "no":
        insurance_opts.append("Yes")

    # Spayed/Neutered: If currently 'No', try 'Yes'.
    spayed_opts = [original_data.spayedNeutered]
    if original_data.spayedNeutered.lower() == "no":
        spayed_opts.append("Yes")

    # Vaccination: If currently 'Not Current', try 'Current'.
    vaccine_opts = [original_data.vaccinationStatus]
    if original_data.vaccinationStatus.lower() != "current":
        vaccine_opts.append("Current")

    # Activity Intensity: Test all standard levels.
    activity_opts = ["Light", "Moderate", "Intense"]

    # Diet: Test all standard diets.
    diet_opts = [
        "Commercial kibble", "Commercial wet", "Home cooked", "Raw", "Freeze-dried"
    ]
    # Ensure current diet is included in the test set for fair comparison,
    # unless it is 'Other'.
    if original_data.primaryDiet not in diet_opts and original_data.primaryDiet != "Other":
        diet_opts.append(original_data.primaryDiet)

    # 2. Generate all combinations (Cartesian product)
    combinations = itertools.product(
        insurance_opts, spayed_opts, vaccine_opts, activity_opts, diet_opts
    )

    best_years = -1.0
    best_config = {}

    # 3. Iterate through combinations and predict
    for ins, spayed, vac, act, diet in combinations:
        # Create a temporary copy of the data with the new parameter combination
        temp_data = original_data.model_copy(update={
            "insurance": ins,
            "spayedNeutered": spayed,
            "vaccinationStatus": vac,
            "activityIntensity": act,
            "primaryDiet": diet
        })

        # Preprocess and Predict
        df_l, _ = preprocess_lifespan(temp_data, model_cols)
        pred_years = float(model.predict(df_l)[0])

        # Track the maximum lifespan found
        if pred_years > best_years:
            best_years = pred_years
            best_config = {
                "insurance": ins,
                "spayedNeutered": spayed,
                "vaccinationStatus": vac,
                "activityIntensity": act,
                "primaryDiet": diet
            }

    # 4. Calculate Gain and Identify Specific Changes
    baseline_df, _ = preprocess_lifespan(original_data, model_cols)
    baseline_years = float(model.predict(baseline_df)[0])

    # Prevent tiny floating point errors (e.g., 1e-15) from registering as a gain
    years_gained = max(0.0, round(best_years - baseline_years, 4))

    changes = {}

    # Check if there is a SIGNIFICANT gain (> 0.05 years)
    if years_gained > 0.05:
        if best_config["insurance"] != original_data.insurance:
            changes[
                "Insurance"] = f"Consider getting insurance ({original_data.insurance} -> {best_config['insurance']})"
        if best_config["spayedNeutered"] != original_data.spayedNeutered:
            changes[
                "Spayed/Neutered"] = f"Consider procedure ({original_data.spayedNeutered} -> {best_config['spayedNeutered']})"
        if best_config["vaccinationStatus"] != original_data.vaccinationStatus:
            changes[
                "Vaccination"] = f"Update status ({original_data.vaccinationStatus} -> {best_config['vaccinationStatus']})"
        if best_config["activityIntensity"] != original_data.activityIntensity:
            changes[
                "Activity"] = f"Adjust intensity ({original_data.activityIntensity} -> {best_config['activityIntensity']})"
        if best_config["primaryDiet"] != original_data.primaryDiet:
            changes["Diet"] = f"Consider diet change ({original_data.primaryDiet} -> {best_config['primaryDiet']})"

    # --- SAFETY NET ---
    # If 'changes' is still empty (either due to insignificant gain or already optimal state),
    # force an affirmation message.
    if not changes:
        years_gained = 0.0  # Reset gain to 0.0 since no actionable advice is provided
        changes[
            "Excellent Care"] = "Great job! Your current care plan is already maximizing your dog's potential lifespan based on our model."

    return {
        "original_lifespan": round(baseline_years, 2),
        "max_potential_lifespan": round(baseline_years + years_gained, 2),  # Ensure consistent math
        "years_gained": round(years_gained, 2),
        "suggested_changes": changes
    }

