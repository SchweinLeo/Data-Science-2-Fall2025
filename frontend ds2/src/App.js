import React, { useState } from 'react';
import DogForm from './components/DogForm';
import ResultPage from './components/ResultPage';
import DetailedAnalysis from './components/DetailedAnalysis';
import FinalReportPage from './components/FinalReportPage';
import './App.css';

/** * Production Backend URL on Render 
 * Note: Replace 'localhost:8000' with this URL for the live environment.
 */
const API_BASE = "https://ds2-fall2025-dog-health-backend.onrender.com"; 

const App = () => {
  // resultData: Stores the current API response (either basic or detailed results)
  const [resultData, setResultData] = useState(null);

  // basicResultData: A persistent cache of the initial assessment results (needed for the 'Back' function)
  const [basicResultData, setBasicResultData] = useState(null);

  // formData: Stores the data from the first form to pass into the detailed analysis step
  const [formData, setFormData] = useState(null);

  // loading: Manages the visibility of the analysis overlay animation
  const [loading, setLoading] = useState(false);

  // view: Navigation state control ('form', 'result', 'detailed', 'final')
  const [view, setView] = useState('form');

  // analysisType: Determines the text displayed on the loading screen
  const [analysisType, setAnalysisType] = useState('basic');

  /**
   * handleFormSubmit:
   * Handles the primary health assessment (/predict).
   * It triggers the loading screen and updates the basic result states.
   */
  const handleFormSubmit = async (data) => {
    setAnalysisType('basic');
    setLoading(true);
    setFormData(data);

    try {
      // Connects to the live Render backend instead of local environment
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      // Artificial delay to allow the animation to play smoothly
      setTimeout(() => {
        setResultData(result);
        setBasicResultData(result); // Cache the basic data
        setLoading(false);
        setView('result');
      }, 1500);
    } catch (err) {
      setLoading(false);
      alert('Network Error: ' + err.message);
    }
  };

  /**
   * handleDetailedSubmit:
   * Handles the advanced health analysis (/predict_detailed).
   * Uses 67 variables to provide a more clinical insight.
   */
  const handleDetailedSubmit = async (fullData) => {
    setAnalysisType('detailed');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/predict_detailed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      });

      const detailedResult = await response.json();

      setTimeout(() => {
        setResultData(detailedResult);
        setLoading(false);
        setView('final');
      }, 2000);
    } catch (err) {
      setLoading(false);
      alert('Detailed Analysis Error: ' + err.message);
    }
  };

  /**
   * handleBackToResult:
   * Re-hydrates the view with the cached basicResultData.
   * Ensures longevity info is visible again when returning from the final report.
   */
  const handleBackToResult = () => {
    setResultData(basicResultData);
    setView('result');
  };

  /**
   * handleReset:
   * Clears all states to restart the assessment flow from the beginning.
   */
  const handleReset = () => {
    setResultData(null);
    setBasicResultData(null);
    setFormData(null);
    setView('form');
    setAnalysisType('basic');
  };

  return (
    <main className="app-main">
      {/* 1. Loading Overlay Layer */}
      {loading && (
        <div className="analysis-overlay fade-in">
          <div className="loader-content">
            <div className="pulse-ring">
              <span className="loader-emoji">🐕</span>
            </div>
            <h2 className="loader-text">Analyzing Health Data</h2>
            <div className="loader-bar-container">
              <div className="loader-bar-fill"></div>
            </div>
            <p className="loader-subtext">
              {analysisType === 'basic'
                ? 'Calculating longevity & risk factors...'
                : 'Cross-referencing 67 environmental & lifestyle variables...'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Content View Container */}
      <div className={`view-wrapper ${loading ? 'content-blur' : ''}`}>
        {/* VIEW A: Initial Assessment Form */}
        {view === 'form' && <DogForm onSubmit={handleFormSubmit} />}

        {/* VIEW B: Basic Results & Lifespan Prediction */}
        {view === 'result' && resultData && (
          <ResultPage
            data={resultData}
            onReset={handleReset}
            onGoToDetailed={() => setView('detailed')}
          />
        )}

        {/* VIEW C: Deep-Dive Questionnaire (42 additional fields) */}
        {view === 'detailed' && (
          <DetailedAnalysis
            prevData={formData}
            onBack={() => setView('result')}
            onComplete={handleDetailedSubmit}
          />
        )}

        {/* VIEW D: Final Diagnostic Report (Model Comparison) */}
        {view === 'final' && resultData && (
          <FinalReportPage
            data={resultData}
            onReset={handleReset}
            onBackToResult={handleBackToResult}
          />
        )}
      </div>
    </main>
  );
};

export default App;
