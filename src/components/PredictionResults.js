import React from 'react';
import '../styles/PredictionResults.css';

const PredictionResults = ({ dogData, predictions, onReset }) => {
  return (
    <div className="prediction-container">
      <div className="dog-info-header">
        <h1 className="dog-name">{dogData.dogName}</h1>
        <p className="dog-details">
          {dogData.breed} • {dogData.size.toUpperCase()} • {dogData.age} years old
        </p>
      </div>

      {/* Health Risks Section */}
      <section className="prediction-section health-risks">
        <div className="section-header">
          <h2>⚠️ Potential Health Risks</h2>
          <p className="section-subtitle">Common concerns for your dog's profile</p>
        </div>
        <div className="risks-grid">
          {predictions.healthRisks.map((risk, idx) => (
            <div key={idx} className="risk-card">
              <h3 className="risk-title">{risk.name}</h3>
              <p className="risk-probability">
                Risk Level: <span className={`level-${risk.level}`}>{risk.level}</span>
              </p>
              <p className="risk-description">{risk.description}</p>
              <div className="risk-symptoms">
                <strong>Watch for:</strong>
                <ul>
                  {risk.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Activities Section */}
      <section className="prediction-section activities">
        <div className="section-header">
          <h2>🏃 Recommended Activities</h2>
          <p className="section-subtitle">Keep your dog active and healthy</p>
        </div>
        <div className="activities-grid">
          {predictions.activities.map((activity, idx) => (
            <div key={idx} className="activity-card">
              <div className="activity-icon">{activity.icon}</div>
              <h3>{activity.name}</h3>
              <p className="duration">
                <strong>Frequency:</strong> {activity.frequency}
              </p>
              <p>{activity.description}</p>
              <p className="benefits">
                <strong>Benefits:</strong> {activity.benefits}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition Section */}
      <section className="prediction-section nutrition">
        <div className="section-header">
          <h2>🥗 Nutrition Recommendations</h2>
          <p className="section-subtitle">Optimal diet for your dog's health</p>
        </div>
        <div className="nutrition-content">
          <div className="nutrition-info">
            <h3>Key Nutrients</h3>
            <div className="nutrients-list">
              {predictions.nutrition.keyNutrients.map((nutrient, idx) => (
                <div key={idx} className="nutrient-item">
                  <span className="nutrient-icon">✓</span>
                  <div>
                    <strong>{nutrient.name}</strong>
                    <p>{nutrient.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="nutrition-info">
            <h3>Foods to Include</h3>
            <div className="foods-list">
              {predictions.nutrition.recommendedFoods.map((food, idx) => (
                <div key={idx} className="food-badge">
                  {food}
                </div>
              ))}
            </div>
          </div>

          <div className="nutrition-info">
            <h3>Foods to Avoid</h3>
            <div className="foods-list avoid">
              {predictions.nutrition.foodsToAvoid.map((food, idx) => (
                <div key={idx} className="food-badge avoid-badge">
                  {food}
                </div>
              ))}
            </div>
          </div>

          <div className="nutrition-info">
            <h3>Daily Caloric Needs</h3>
            <p className="calories">
              Approximately <strong>{predictions.nutrition.dailyCalories}</strong> calories per day
            </p>
            <p className="calorie-note">
              Adjust based on activity level and consult your vet for personalized recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* General Tips Section */}
      <section className="prediction-section tips">
        <div className="section-header">
          <h2>💡 General Health Tips</h2>
        </div>
        <ul className="tips-list">
          {predictions.generalTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </section>

      <div className="action-buttons">
        <button className="reset-btn" onClick={onReset}>
          Check Another Dog
        </button>
        <button className="print-btn" onClick={() => window.print()}>
          Print Results
        </button>
      </div>
    </div>
  );
};

export default PredictionResults;
