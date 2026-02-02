import React, { useState } from 'react';
import '../styles/DetailedAnalysis.css'; 

/**
 * DetailedAnalysis Component
 * Handles the comprehensive health data entry, including a review of basic profile info
 * and detailed environmental, dietary, and behavioral metrics.
 */
const DetailedAnalysis = ({ prevData, onComplete, onBack }) => {
  // State for the initial profile data (allows editing existing records)
  const [basicData, setBasicData] = useState({ ...prevData });
  const [isEditing, setIsEditing] = useState(false);
  
  // State for the granular analysis form fields
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

  // Updates the top-level basic profile state
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicData({ ...basicData, [name]: value });
  };

  // Updates the specific analysis form state
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Configuration constants for dropdown selections
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dietOptions = ["Commercial Kibble", "Commercial Wet", "Freeze-dried", "Home Cooked", "Raw", "Other"];
  const incomeOptions = Array.from({ length: 10 }, (_, i) => `$${i * 25000} - $${(i + 1) * 25000}`).concat(["$250,000+"]);

  return (
    <div className="detailed-viewport">
      <div className="detailed-card fade-in">
        
        <header className="compact-header">
          <h1 className="brand-title">Precision Health Matrix</h1>
          <p className="step-label">Complete all 42 indicators for {basicData.dogName}</p>
        </header>

        <div className="form-content scrollable-container">
          
          {/* SECTION 1: BASIC PROFILE REVIEW (3 columns per row) */}
          <div className="compact-reference">
            <div className="ref-header-row">
              <h3 className="tiny-label">Basic Profile Review</h3>
              <button className="edit-toggle-btn" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Save Changes' : 'Edit Basic Info'}
              </button>
            </div>
            <div className="ref-grid-3">
              {[
                { label: 'Name', name: 'dogName', type: 'text' },
                { label: 'Breed', name: 'breed', type: 'text' },
                { label: 'Sex', name: 'sex', type: 'select', options: ['male', 'female'] },
                { label: 'Birth Year', name: 'birthYear', type: 'number' },
                { label: 'Birth Month', name: 'birthMonth', type: 'select', options: months },
                { label: 'Weight (kg)', name: 'weight', type: 'number' },
                { label: 'Breed Status', name: 'breedState', type: 'select', options: ['Pure', 'Mixed'] },
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
                        <select name={field.name} value={basicData[field.name] || ''} onChange={handleBasicChange}>
                          <option value="">Select</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input type={field.type} name={field.name} value={basicData[field.name] || ''} onChange={handleBasicChange} />
                      )}
                    </div>
                  ) : (
                    <div className="ref-display-box">
                      <span className="cell-label">{field.label}:</span>
                      <span className="cell-value">{basicData[field.name] || '--'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="tight-form-body grid-3">
            {/* SECTION 2: PHYSICAL ACTIVITY */}
            <h3 className="section-divider">Physical Activity Details</h3>
            <div className="field-group"><label>Mod. Weather Hours</label><input type="number" id="pa_moderate_weather_daily_hours_outside" step="0.5" placeholder="Hours" onChange={handleChange} /></div>
            <div className="field-group"><label>Hot Months/Year</label><input type="number" id="pa_hot_weather_months_per_year" step="0.1" placeholder="Count" onChange={handleChange} /></div>
            <div className="field-group"><label>Cold Months/Year</label><input type="number" id="pa_cold_weather_months_per_year" step="0.1" placeholder="Count" onChange={handleChange} /></div>

            {/* SECTION 3: DIET DETAILS */}
            <h3 className="section-divider">Diet & Supplements</h3>
            <div className="field-group"><label>Diet Consistency</label><select id="df_diet_consistency" onChange={handleChange}><option value="">-- Select --</option><option>Consistent</option><option>Variable</option><option>Unknown</option></select></div>
            <div className="field-group"><label>Appetite Change</label><select id="df_appetite_change_last_year" onChange={handleChange}><option value="">-- Select --</option><option>No</option><option>Yes</option><option>Unknown</option></select></div>
            <div className="field-group"><label>Ever Overweight</label><select id="df_ever_overweight" onChange={handleChange}><option value="">-- Select --</option><option>Yes</option><option>No</option><option>Unknown</option></select></div>
            <div className="field-group"><label>Daily Supps</label><select id="df_daily_supplements" onChange={handleChange}><option value="">-- Select --</option><option>Yes</option><option>No</option></select></div>
            <div className="field-group"><label>Glucosamine</label><select id="df_daily_supplements_glucosamine" onChange={handleChange}><option value="">-- Select --</option><option>Yes</option><option>No</option></select></div>
            <div className="field-group"><label>Omega-3</label><select id="df_daily_supplements_omega3" onChange={handleChange}><option value="">-- Select --</option><option>Yes</option><option>No</option></select></div>

            {/* SECTION 4: BEHAVIOR & MEDICAL */}
            <h3 className="section-divider">Behavior & Medical Care</h3>
            <div className="field-group"><label>Fear: Unknown</label><select id="db_fear_level_unknown_situations" onChange={handleChange}><option value="">-- Select --</option><option>Low</option><option>Moderate</option><option>High</option><option>Unknown</option></select></div>
            <div className="field-group"><label>Barking (Alone)</label><select id="db_left_alone_barking_frequency" onChange={handleChange}><option value="">-- Select --</option><option>Never</option><option>Rarely</option><option>Often</option><option>Unknown</option></select></div>
            <div className="field-group"><label>Attention Seeking</label><select id="db_attention_seeking_follows_humans_frequency" onChange={handleChange}><option value="">-- Select --</option><option>Rarely</option><option>Sometimes</option><option>Often</option><option>Unknown</option></select></div>
            <div className="field-group"><label>Dental Brushing</label><select id="mp_dental_brushing_frequency" onChange={handleChange}><option value="">-- Select --</option><option>Never</option><option>Rarely</option><option>Sometimes</option><option>Daily</option></select></div>
            <div className="field-group"><label>Flea Treatment</label><select id="mp_flea_and_tick_treatment" onChange={handleChange}><option value="">-- Select --</option><option>Never</option><option>Annually</option><option>Monthly</option><option>Unknown</option></select></div>
            <div className="field-group"><label>Heartworm Prev</label><select id="mp_heartworm_preventative" onChange={handleChange}><option value="">-- Select --</option><option>Yes</option><option>No</option><option>Unknown</option></select></div>

            {/* SECTION 5: ENVIRONMENT & HOUSEHOLD */}
            <h3 className="section-divider">Environment & Household</h3>
            <div className="field-group"><label>Sleep (Night)</label><input type="number" id="de_nighttime_sleep_avg_hours" step="0.5" onChange={handleChange} /></div>
            <div className="field-group"><label>Sleep (Day)</label><input type="number" id="de_daytime_sleep_avg_hours" step="0.5" onChange={handleChange} /></div>
            <div className="field-group"><label>Water Source</label><select id="de_drinking_water_source" onChange={handleChange}><option value="">-- Select --</option><option>Tap</option><option>Filtered</option><option>Bottled</option><option>Well</option></select></div>
            <div className="field-group"><label>Radon Present</label><select id="de_radon_present" onChange={handleChange}><option value="">-- Select --</option><option>Yes</option><option>No</option><option>Unknown</option></select></div>
            <div className="field-group"><label>Air Condition</label><select id="de_central_air_conditioning_present" onChange={handleChange}><option value="">-- Select --</option><option>Yes</option><option>No</option></select></div>
            <div className="field-group"><label>Stairs in Home</label><select id="de_stairs_in_home" onChange={handleChange}><option value="">-- Select --</option><option>Yes</option><option>No</option></select></div>
            <div className="field-group"><label>People Count</label><input type="number" id="oc_household_person_count" onChange={handleChange} /></div>
            <div className="field-group"><label>Child Count</label><input type="number" id="oc_household_child_count" onChange={handleChange} /></div>
            <div className="field-group"><label>Other Dogs</label><input type="number" id="de_other_present_animals_dogs" onChange={handleChange} /></div>
          </div>

          <div className="btn-container split sticky-bottom">
            <button className="btn-outline-pill" onClick={onBack}>Cancel</button>
            <button className="btn-solid-pill" onClick={() => onComplete({...basicData, ...formData})}>Run Deep Analysis ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysis;
