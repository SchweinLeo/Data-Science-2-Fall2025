import React, { useState } from 'react';
import DogForm from './components/DogForm';
import ResultPage from './components/ResultPage';
import DetailedAnalysis from './components/DetailedAnalysis';
import FinalReportPage from './components/FinalReportPage';
import './App.css';

const App = () => {
  // Stores the current view's API response (basic or detailed)
  const [resultData, setResultData] = useState(null);

  // Stores the basic result response as a backup (includes lifespan fields)
  const [basicResultData, setBasicResultData] = useState(null);

  // Stores the last submitted basic form data (used to prefill detailed step)
  const [formData, setFormData] = useState(null);

  // Controls the loading overlay visibility
  const [loading, setLoading] = useState(false);

  // View state machine: form -> result -> detailed -> final
  const [view, setView] = useState('form');

  // Controls which loading message to show (basic vs detailed)
  const [analysisType, setAnalysisType] = useState('basic');

  /**
   * Submits the basic assessment request to /predict
   * - Saves the response to resultData
   * - Also caches it into basicResultData so we can restore it later
   */
  const handleFormSubmit = async (data) => {
    setAnalysisType('basic');
    setLoading(true);
    setFormData(data);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      // Add a short delay for a smoother loading experience
      setTimeout(() => {
        setResultData(result);
        setBasicResultData(result);
        setLoading(false);
        setView('result');
      }, 1500);
    } catch (err) {
      setLoading(false);
      alert('Error: ' + err.message);
    }
  };

  /**
   * Submits the detailed assessment request to /predict_detailed
   * - Updates resultData with the detailed response
   * - The detailed response may not include lifespan fields
   */
  const handleDetailedSubmit = async (fullData) => {
    setAnalysisType('detailed');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/predict_detailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      });

      const detailedResult = await response.json();

      // Add a short delay for a smoother loading experience
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
   * Restores the basic result page after viewing the final (detailed) report
   * This is needed because the detailed response may not contain lifespan data.
   */
  const handleBackToResult = () => {
    setResultData(basicResultData);
    setView('result');
  };

  /**
   * Resets the entire flow back to the form view
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
      {/* Full-screen loading overlay */}
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

            {/* Loading message changes depending on the analysis type */}
            <p className="loader-subtext">
              {analysisType === 'basic'
                ? 'Calculating longevity & risk factors...'
                : 'Cross-referencing 67 environmental & lifestyle variables...'}
            </p>
          </div>
        </div>
      )}

      {/* Wrapper to optionally blur underlying content when loading */}
      <div className={`view-wrapper ${loading ? 'content-blur' : ''}`}>
        {/* Step 1: Input form */}
        {view === 'form' && <DogForm onSubmit={handleFormSubmit} />}

        {/* Step 2: Basic results */}
        {view === 'result' && resultData && (
          <ResultPage
            data={resultData}
            onReset={handleReset}
            onGoToDetailed={() => setView('detailed')}
          />
        )}

        {/* Step 3: Detailed input form */}
        {view === 'detailed' && (
          <DetailedAnalysis
            prevData={formData}
            onBack={() => setView('result')}
            onComplete={handleDetailedSubmit}
          />
        )}

        {/* Step 4: Final report (basic vs advanced comparison) */}
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
