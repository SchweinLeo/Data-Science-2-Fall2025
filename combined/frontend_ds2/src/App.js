import React, { useState } from 'react';
import DogForm from './components/DogForm';
import ResultPage from './components/ResultPage';
import DetailedAnalysis from './components/DetailedAnalysis';
import FinalReportPage from './components/FinalReportPage';
import './App.css';

/** * PRODUCTION CONFIGURATION
 * Replace localhost with your live Render backend URL.
 * Ensure your backend's CORS settings allow requests from your Vercel domain.
 */
const API_BASE = "https://ds2-fall2025-dog-health-backend.onrender.com"; 

const App = () => {
  // resultData: Stores the current API response (basic or detailed results)
  const [resultData, setResultData] = useState(null);

  // basicResultData: Caches the initial result to allow "Back" navigation from final reports
  const [basicResultData, setBasicResultData] = useState(null);

  // formData: Persists the primary form input to pre-fill the detailed analysis step
  const [formData, setFormData] = useState(null);

  // loading: Controls the visibility of the full-screen analysis overlay
  const [loading, setLoading] = useState(false);

  // view: State machine for navigation ('form' -> 'result' -> 'detailed' -> 'final')
  const [view, setView] = useState('form');

  // analysisType: Switches the loading message context (basic vs clinical)
  const [analysisType, setAnalysisType] = useState('basic');

  /**
   * handleFormSubmit:
   * Communicates with the /predict endpoint for the initial lifespan and risk assessment.
   * Triggered by the DogForm component.
   */
  const handleFormSubmit = async (data) => {
    setAnalysisType('basic');
    setLoading(true);
    setFormData(data);

    try {
      // Connects to the Render production API
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Backend is sleeping or unreachable');

      const result = await response.json();

      // Artificial delay to ensure the UI transitions smoothly during heavy ML processing
      setTimeout(() => {
        setResultData(result);
        setBasicResultData(result); 
        setLoading(false);
        setView('result');
      }, 1500);
    } catch (err) {
      setLoading(false);
      alert('Network Error: ' + err.message + '. Please ensure the backend is awake.');
    }
  };

  /**
   * handleDetailedSubmit:
   * Communicates with the /predict_detailed endpoint using 67 clinical variables.
   * Triggered by the DetailedAnalysis component.
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

      if (!response.ok) throw new Error('Detailed analysis failed');

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
   * Re-sets the UI state to the cached basic result data.
   * Necessary because detailed results might not include initial lifespan predictions.
   */
  const handleBackToResult = () => {
    setResultData(basicResultData);
    setView('result');
  };

  /**
   * handleReset:
   * Resets all states to default to allow a fresh start for a new pet assessment.
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
      {/* 1. ANIMATED LOADING OVERLAY */}
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

      {/* 2. DYNAMIC VIEW CONTAINER */}
      <div className={`view-wrapper ${loading ? 'content-blur' : ''}`}>
        {/* PHASE 1: Data Entry */}
        {view === 'form' && <DogForm onSubmit={handleFormSubmit} />}

        {/* PHASE 2: Initial Predictions Display */}
        {view === 'result' && resultData && (
          <ResultPage
            data={resultData}
            onReset={handleReset}
            onGoToDetailed={() => setView('detailed')}
          />
        )}

        {/* PHASE 3: Comprehensive Clinical Data Entry */}
        {view === 'detailed' && (
          <DetailedAnalysis
            prevData={formData}
            onBack={() => setView('result')}
            onComplete={handleDetailedSubmit}
          />
        )}

        {/* PHASE 4: Final Diagnostic Comparison Report */}
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
