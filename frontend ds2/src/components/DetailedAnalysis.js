import React, { useState } from 'react';
import '../styles/DetailedAnalysis.css';

/**
 * DetailedAnalysis component
 * --------------------------
 * This component collects extended (67-feature) health data for a dog.
 * It also allows reviewing and editing the previously entered basic profile.
 *
 * Props:
 * - prevData: basic dog profile data from the previous step
 * - onComplete: callback triggered when the user finishes the detailed form
 * - onBack: callback triggered when the user cancels or goes back
 */
const DetailedAnalysis = ({ prevData, onComplete, onBack }) => {
  // Local copy of basic profile data (editable)
  const [basicData, setBasicData] = useState({ ...prevData });

  // Controls whether the basic profile is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  /**
   * State for all additional detailed features.
   * Keys are aligned with backend feature names.
   */
  const [formData, setFormData] = useState({
    pa_moderate_weather_daily_hours_outside: '',
    pa_hot_weather_months_per_year: '',
    pa_cold_weather_months_per_year: '',
    df_diet_consistency: '',
    df_appetite_change_last_year: '',
    df_ever_overweight: '',
    df_daily_supplements: '',
    df_daily_supplements_glucosamine: '',
    df_daily_supplements_omega3: '',
    db_fear_level_unknown_situations: '',
    db_left_alone_barking_frequency: '',
    db_attention_seeking_follows_humans_frequency: '',
    mp_dental_brushing_frequency: '',
    mp_flea_and_tick_treatment: '',
    mp_heartworm_preventative: '',
    de_nighttime_sleep_avg_hours: '',
    de_daytime_sleep_avg_hours: '',
    de_drinking_water_source: '',
    de_radon_present: '',
    de_central_air_conditioning_present: '',
    de_stairs_in_home: '',
    oc_household_person_count: '',
    oc_household_child_count: '',
    de_other_present_animals_dogs: ''
  });

  /**
   * Handles changes to basic profile fields (name, breed, weight, etc.)
   */
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicData({ ...basicData, [name]: value });
  };

  /**
   * Handles changes to detailed feature fields
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Static option lists
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dietOptions = [
    'Commercial Kibble',
    'Commercial Wet',
    'Freeze-dried',
    'Home Cooked',
    'Raw',
    'Other'
  ];

  const incomeOptions = Array.from(
    { length: 10 },
    (_, i) => `$${i * 25000} - $${(i + 1) * 25000}`
  ).concat(['$250,000+']);

  return (
    <div className="detailed-viewport">
      <div className="detailed-card fade-in">

        {/* Header */}
        <header className="compact-header">
          <h1 className="brand-title">Precision Health Matrix</h1>
          <p className="step-label">
            Complete all indicators for {basicData.dogName}
          </p>
        </header>

        <div className="form-content scrollable-container">

          {/* Section 1: Basic profile review and optional editing */}
          <div className="compact-reference">
            <div className="ref-header-row">
              <h3 className="tiny-label">Basic Profile Review</h3>
              <button
                className="edit-toggle-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Save Changes' : 'Edit Basic Info'}
              </button>
            </div>

            {/* Grid layout for basic profile fields */}
            <div className="ref-grid-3">
              {[
                { label: 'Name', name: 'dogName', type: 'text' },
                { label: 'Breed', name: 'breed', type: 'text' },
                { label: 'Sex', name: 'sex', type: 'select', options: ['male', 'female'] },
                { label: 'Birth Year', name: 'birthYear', type: 'number' },
                { label: 'Birth Month', name: 'birthMonth', type: 'select', options: months },
                { label: 'Weight (kg)', name: 'weight', type: 'number' },
                { label: 'Breed State', name: 'breedState', type: 'select', options: ['Pure', 'Mixed'] },
                { label: 'Active Hours', name: 'dailyActiveHours', type: 'number' },
                { label: 'Activity Level', name: 'activityLevel', type: 'select', options: ['Low', 'Moderate', 'High', 'Very High'] },
                { label: 'Intensity', name: 'activityIntensity', type: 'select', options: ['Light', 'Moderate', 'Intense'] },
                { label: 'Primary Diet', name: 'primaryDiet', type: 'select', options: dietOptions },
                { label: 'Appetite', name: 'appetiteLevel', type: 'select', options: ['Poor', 'Normal', 'Excellent'] },
                { label: 'Income', name: 'annualIncome', type: 'select', options: incomeOptions },
                { label: 'Neutered', name: 'spayedNeutered', type: 'select', options: ['Yes', 'No'] },
                { label: 'Vaccination', name: 'vaccinationStatus', type: 'select', options: ['Current', 'Not Current'] },
                { label: 'Insurance', name: 'insurance', type: 'select', options: ['Yes', 'No'] },
                { label: 'Home Type', name: 'homeType', type: 'select', options: ['House', 'Apartment', 'Condo'] },
                { label: 'Home Area', name: 'homeArea', type: 'select', options: ['Urban', 'Suburban', 'Rural'] }
              ].map((field) => (
                <div key={field.name} className="ref-cell-wrapper">
                  {isEditing ? (
                    <div className="ref-edit-box">
                      <label>{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={basicData[field.name] || ''}
                          onChange={handleBasicChange}
                        >
                          <option value="">Select</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={basicData[field.name] || ''}
                          onChange={handleBasicChange}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="ref-display-box">
                      <span className="cell-label">{field.label}:</span>
                      <span className="cell-value">
                        {basicData[field.name] || '--'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2–5: Detailed feature input fields */}
          <div className="tight-form-body grid-3">

            <h3 className="section-divider">Physical Activity</h3>
            <div className="field-group">
              <label>Moderate Weather Hours</label>
              <input
                type="number"
                id="pa_moderate_weather_daily_hours_outside"
                step="0.5"
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Hot Months per Year</label>
              <input
                type="number"
                id="pa_hot_weather_months_per_year"
                step="0.1"
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Cold Months per Year</label>
              <input
                type="number"
                id="pa_cold_weather_months_per_year"
                step="0.1"
                onChange={handleChange}
              />
            </div>

            <h3 className="section-divider">Diet & Supplements</h3>
            <div className="field-group">
              <label>Diet Consistency</label>
              <select id="df_diet_consistency" onChange={handleChange}>
                <option value="">Select</option>
                <option>Consistent</option>
                <option>Variable</option>
                <option>Unknown</option>
              </select>
            </div>

            <h3 className="section-divider">Environment & Household</h3>
            <div className="field-group">
              <label>Night Sleep (hours)</label>
              <input
                type="number"
                id="de_nighttime_sleep_avg_hours"
                step="0.5"
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Day Sleep (hours)</label>
              <input
                type="number"
                id="de_daytime_sleep_avg_hours"
                step="0.5"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="btn-container split sticky-bottom">
            <button className="btn-outline-pill" onClick={onBack}>
              Cancel
            </button>
            <button
              className="btn-solid-pill"
              onClick={() => onComplete({ ...basicData, ...formData })}
            >
              Run Deep Analysis ✓
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysis;
