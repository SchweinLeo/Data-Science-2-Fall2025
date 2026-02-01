import React from 'react';
import '../styles/ResultPage.css';

/**
 * ResultPage component
 * --------------------
 * Displays the primary (basic) analysis results returned by the backend:
 * - Dog profile summary
 * - Lifespan prediction (total + remaining)
 * - Longevity optimization suggestions
 * - Overall risk index (average risk)
 * - Per-disease risk breakdown
 *
 * Props:
 * - data: API response object from /predict
 * - onReset: callback to restart the assessment flow
 * - onGoToDetailed: callback to navigate to the detailed (advanced) analysis form
 */
const ResultPage = ({ data, onReset, onGoToDetailed }) => {
  // Defensive rendering: if no data exists, do not render the page
  if (!data) return null;

  // Extract relevant fields from the API response
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
        {/* Page header */}
        <header className="result-header">
          <h1 className="main-title">Health Analysis Report</h1>

          {/* Summary banner with conditional styling based on average risk */}
          <div className={`status-banner ${average_risk > 50 ? 'risk-high' : 'risk-stable'}`}>
            {summary}
          </div>
        </header>

        <div className="bento-grid">
          {/* 1) Dog profile */}
          <section className="bento-box profile-box">
            <h2 className="box-label">Dog Profile</h2>
            <div className="profile-content">
              <div className="avatar-large">🐕</div>

              <div className="profile-details">
                <p className="dog-name">{dog_profile?.name}</p>
                <div className="tag-group">
                  <span className="info-tag">{dog_profile?.sex}</span>
                  <span className="info-tag">{dog_profile?.age} Years Old</span>
                  <span className="info-tag">{dog_profile?.weight} kg</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2) Lifespan prediction */}
          <section className="bento-box lifespan-box">
            <h2 className="box-label">Lifespan Expectancy</h2>

            <div className="lifespan-display">
              <div className="stat-item">
                <span className="stat-number">{lifespan_prediction?.total_estimated_years ?? '--'}</span>
                <span className="stat-unit">Total Estimated Years</span>
              </div>

              <div className="divider-v"></div>

              <div className="stat-item highlight">
                <span className="stat-number">{lifespan_prediction?.remaining_years ?? '--'}</span>
                <span className="stat-unit">Years Remaining</span>
              </div>
            </div>
          </section>

          {/* 3) Longevity optimization suggestions */}
          <section className="bento-box optimization-box full-width">
            <h2 className="box-label">Longevity Optimization</h2>

            <div className="optimization-content">
              <div className="opt-header">
                {/* Highlight estimated improvement if the user applies suggested changes */}
                <div className="gain-indicator">
                  <span className="gain-label">Potential Improvement</span>
                  <span className="gain-value">
                    +{lifespan_optimization?.years_gained || 0} <small>Years</small>
                  </span>
                </div>

                {/* Show different copy depending on whether improvement is meaningful */}
                {lifespan_optimization?.years_gained > 0.05 ? (
                  <p className="opt-summary-text">
                    Adjusting care can increase total lifespan to
                    <strong> {lifespan_optimization?.max_potential_lifespan} years</strong>.
                  </p>
                ) : (
                  <p className="opt-summary-text">
                    <strong>Excellent Care:</strong> Great job! Your current care plan is already maximizing your
                    dog's potential lifespan based on our model.
                  </p>
                )}
              </div>

              {/* Render suggested changes if available (excluding duplicate "Excellent Care" row) */}
              <div className="suggestion-list">
                {lifespan_optimization?.suggested_changes &&
                  Object.entries(lifespan_optimization.suggested_changes)
                    .filter(([key]) => key !== 'Excellent Care')
                    .map(([key, value], index) => (
                      <div key={index} className="suggestion-item">
                        <span className="suggest-key">{key}</span>
                        <span className="suggest-val">{value}</span>
                      </div>
                    ))}
              </div>
            </div>
          </section>

          {/* 4) Overall risk gauge */}
          <section className="bento-box risk-gauge-box">
            <h2 className="box-label">Health Risk Index</h2>

            <div className="gauge-container">
              <div className="gauge-value">{Math.round(average_risk || 0)}%</div>
              <div className="gauge-bar-wrap">
                <div className="gauge-fill" style={{ width: `${average_risk || 0}%` }} />
              </div>
            </div>
          </section>

          {/* 5) Per-disease risk breakdown */}
          <section className="bento-box disease-box">
            <h2 className="box-label">Risk Breakdown</h2>

            <div className="disease-list-compact">
              {predictions?.map((p, idx) => (
                <div key={idx} className="disease-mini-card">
                  <div className="mini-header">
                    <span>{p.disease}</span>
                    <span className={p.risk_score > 60 ? 'txt-red' : 'txt-blue'}>
                      {p.risk_score}%
                    </span>
                  </div>

                  <div className="mini-progress">
                    <div className="mini-fill" style={{ width: `${p.risk_score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Action buttons */}
        <div
          className="action-area"
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginTop: '30px'
          }}
        >
          <button className="btn-outline-pill" onClick={onReset}>
            New Assessment
          </button>
          <button className="btn-solid-pill" onClick={onGoToDetailed}>
            Deep Dive Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
