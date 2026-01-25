import React, { useState } from 'react';
import DogForm from './components/DogForm';
import ResultPage from './components/ResultPage';
import './App.css'; // 确保引入了包含加载样式的 CSS

const App = () => {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true); // 开始显示加载界面
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Prediction failed');

      const data = await response.json();
      
      // 模拟一点延迟，让过渡动画更丝滑
      setTimeout(() => {
        setResultData(data);
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="app-main">
      {/* 动态加载过渡界面 */}
      {loading && (
        <div className="analysis-overlay fade-in">
          <div className="mesh-background"></div> {/* 复用网格背景 */}
          <div className="loader-content">
            <div className="pulse-ring">
              <span className="loader-emoji">🐕</span>
            </div>
            <h2 className="loader-text">Analyzing Health Data</h2>
            <div className="loader-bar-container">
              <div className="loader-bar-fill"></div>
            </div>
            <p className="loader-subtext">Calculating longevity & risk factors...</p>
          </div>
        </div>
      )}

      {!resultData ? (
        <DogForm onSubmit={handleFormSubmit} />
      ) : (
        <ResultPage data={resultData} onReset={() => setResultData(null)} />
      )}
    </main>
  );
};

export default App;