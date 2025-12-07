import React, { useState } from 'react';
import './App.css';
import DogForm from './components/DogForm';
import PredictionResults from './components/PredictionResults';
import getPredictions from './utils/getPredictions';

function App() {
  const [showResults, setShowResults] = useState(false);
  const [dogData, setDogData] = useState(null);
  const [predictions, setPredictions] = useState(null);

  const handleFormSubmit = (formData) => {
    setDogData(formData);
    const predictionData = getPredictions(formData);
    setPredictions(predictionData);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setDogData(null);
    setPredictions(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🐕 Dog Aging & Health Prediction</h1>
        <p>Understand your dog's health needs and predict potential issues</p>
      </header>

      <main className="app-main">
        {!showResults ? (
          <DogForm onSubmit={handleFormSubmit} />
        ) : (
          dogData &&
          predictions && (
            <PredictionResults
              dogData={dogData}
              predictions={predictions}
              onReset={handleReset}
            />
          )
        )}
      </main>

      <footer className="app-footer">
        <p>
          ⚠️ <strong>Disclaimer:</strong> This app provides general information and should not replace
          professional veterinary advice. Always consult your veterinarian for health concerns.
        </p>
      </footer>
    </div>
  );
}

export default App;
