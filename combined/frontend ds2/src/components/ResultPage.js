import React from 'react';
import '../styles/ResultPage.css';

/**
 * ResultPage Component
 * Optimized for better readability with large fonts and structured bento grid.
 * Sequence: Profile -> Lifespan -> Optimization -> Disease Risk
 */
const ResultPage = ({ data, onReset }) => {
  if (!data) return null;

  const { 
    dog_profile, 
    lifespan_prediction, 
    predictions, 
    average_risk, 
    summary,
    lifespan_optimization 
  } = data;

  return (
    <div className="fintech-viewport">
      <div className="mesh-background"></div>
      <div className="result-container fade-in">
        
        {/* HEADER: Overall Summary Status */}
        <header className="result-header">
          <h1 className="main-title">Health Analysis Report</h1>
          <div className={`status-banner ${average_risk > 50 ? 'risk-high' : 'risk-stable'}`}>
            {summary}
          </div>
        </header>

        <div className="bento-grid">
          
          {/* 1. BASIC PROFILE - Large fonts for dog's identity */}
          <section className="bento-box profile-box">
            <h2 className="box-label">Dog Profile</h2>
            <div className="profile-content">
              <div className="avatar-large">🐕</div>
              <div className="profile-details">
                <p className="dog-name">{dog_profile.name}</p>
                <div className="tag-group">
                  <span className="info-tag">{dog_profile.sex}</span>
                  <span className="info-tag">{dog_profile.age} Years Old</span>
                  <span className="info-tag">{dog_profile.weight} kg</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. LIFESPAN EXPECTANCY - Focus on estimated years */}
          <section className="bento-box lifespan-box">
            <h2 className="box-label">Lifespan Expectancy</h2>
            <div className="lifespan-display">
              <div className="stat-item">
                <span className="stat-number">{lifespan_prediction.total_estimated_years}</span>
                <span className="stat-unit">Total Estimated Years</span>
              </div>
              <div className="divider-v"></div>
              <div className="stat-item highlight">
                <span className="stat-number">{lifespan_prediction.remaining_years}</span>
                <span className="stat-unit">Years Remaining</span>
              </div>
            </div>
          </section>

          {/* 3. OPTIMIZATION - Full width to show potential gain and specific suggestions */}
          <section className="bento-box optimization-box full-width">
            <h2 className="box-label">Longevity Optimization</h2>
            <div className="optimization-content">
              <div className="opt-header">
                <div className="gain-indicator">
                  <span className="gain-label">Potential Improvement</span>
                  <span className="gain-value">+{lifespan_optimization.years_gained} <small>Years</small></span>
                </div>
                <p className="opt-summary-text">
                  Adjusting care can increase total lifespan to 
                  <strong> {lifespan_optimization.max_potential_lifespan} years</strong>.
                </p>
              </div>
              
              <div className="suggestion-list">
                {Object.entries(lifespan_optimization.suggested_changes).map(([key, value], index) => (
                  <div key={index} className={`suggestion-item ${key === 'Excellent Care' ? 'care-success' : ''}`}>
                    <span className="suggest-key">{key}</span>
                    <span className="suggest-val">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. HEALTH RISK GAUGE */}
          <section className="bento-box risk-gauge-box">
            <h2 className="box-label">Health Risk Index</h2>
            <div className="gauge-container">
              <div className="gauge-value">{Math.round(average_risk)}%</div>
              <div className="gauge-bar-wrap">
                <div className="gauge-fill" style={{ width: `${average_risk}%` }}></div>
              </div>
            </div>
          </section>

          {/* 5. DISEASE PREDICTIONS */}
          <section className="bento-box disease-box">
            <h2 className="box-label">Risk Breakdown</h2>
            <div className="disease-list-compact">
              {predictions.map((p, idx) => (
                <div key={idx} className="disease-mini-card">
                  <div className="mini-header">
                    <span>{p.disease}</span>
                    <span className={p.risk_score > 60 ? 'txt-red' : 'txt-blue'}>{p.risk_score}%</span>
                  </div>
                  <div className="mini-progress">
                    <div className="mini-fill" style={{ width: `${p.risk_score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="action-area">
          <button className="btn-solid-pill" onClick={onReset}>
            Restart New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;