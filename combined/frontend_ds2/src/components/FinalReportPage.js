import React from 'react';
import '../styles/FinalReportPage.css';

/**
 * FinalReportPage component
 * -------------------------
 * Displays the final comparison report between:
 * - Basic model predictions (19 features)
 * - Advanced model predictions (67 features)
 *
 * Props:
 * - data: API response object containing dog_profile, predictions, honesty_level, etc.
 * - onReset: callback to start a new assessment flow
 * - onBackToResult: callback to return to the previous summary screen
 */
const FinalReportPage = ({ data, onReset, onBackToResult }) => {
  // If no report data exists, render nothing
  if (!data) return null;

  // Extract key fields from API response
  const { dog_profile, predictions, honesty_level } = data;

  // Split predictions by model type for side-by-side comparison
  const basicResults = predictions.filter((p) => p.model_type === 'basic');
  const advancedResults = predictions.filter((p) => p.model_type === 'advanced');

  return (
    <div className="report-viewport">
      <div className="report-container fade-in">
        {/* Report header */}
        <header className="report-header">
          <div className="badge-precision">DIAGNOSTIC COMPARISON</div>
          <h1 className="main-title">{dog_profile.name}&apos;s Health Intelligence</h1>
          <p className="honesty-tag">Reliability: {honesty_level}</p>
        </header>

        <div className="report-grid-full">
          {/* Section 1: Basic Model (19-feature pipeline) */}
          <section className="analysis-section">
            <div className="section-header-flex">
              <h2 className="section-label">Risk Breakdown (Basic Model)</h2>
            </div>

            {/* Render a card per disease category */}
            <div className="matrix-grid">
              {basicResults.map((p, idx) => (
                <div key={`basic-${idx}`} className="risk-card basic-card">
                  <div className="card-top">
                    <span className="disease-name">{p.disease}</span>
                    <span className="score-tag">{p.risk_score}%</span>
                  </div>

                  {/* Risk bar visualization */}
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${p.risk_score}%` }}
                    />
                  </div>

                  {/* Interpretation text from backend */}
                  <div className="adv-details">
                    <p>
                      <strong>Clinical Insight:</strong> {p.interpretation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Advanced Model (67-feature pipeline) */}
          <section className="analysis-section highlight-section">
            <div className="section-header-flex">
              <h2 className="section-label">Risk Breakdown (Advanced Model)</h2>
            </div>

            {/* Render a card per disease category */}
            <div className="matrix-grid">
              {advancedResults.map((p, idx) => (
                <div key={`adv-${idx}`} className="risk-card advanced-card">
                  <div className="card-top">
                    <span className="disease-name">{p.disease}</span>
                    <span className="score-tag high-contrast">{p.risk_score}%</span>
                  </div>

                  {/* Risk bar visualization (advanced styling) */}
                  <div className="progress-track">
                    <div
                      className="progress-fill adv-fill"
                      style={{ width: `${p.risk_score}%` }}
                    />
                  </div>

                  {/* Interpretation text from backend */}
                  <div className="adv-details">
                    <p>
                      <strong>Clinical Insight:</strong> {p.interpretation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <footer
          className="report-actions"
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginTop: '40px'
          }}
        >
          <button className="btn-outline-pill" onClick={onBackToResult}>
            ← Back to Summary
          </button>
          <button className="btn-solid-pill" onClick={onReset}>
            New Audit
          </button>
        </footer>
      </div>
    </div>
  );
};

export default FinalReportPage;
