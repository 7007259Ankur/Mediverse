// src/pages/AIPredictions.jsx
import { useState, useEffect } from 'react';
import { Activity, HeartPulse, Brain, Syringe, ShieldCheck, AlertTriangle } from 'lucide-react';
import './AIPredictions.css';

export default function AIPredictions() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('diabetes');
  const [prediction, setPrediction] = useState(null);
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const healthDomains = [
    {
      id: 'diabetes',
      name: 'Diabetes Risk',
      icon: <Activity className="w-5 h-5" />,
      inputs: [
        { name: 'glucose', label: 'Glucose (mg/dL)', normalRange: [70, 99] },
        { name: 'hba1c', label: 'HbA1c (%)', normalRange: [4, 5.6] },
        { name: 'bmi', label: 'BMI', normalRange: [18.5, 24.9] }
      ]
    },
    {
      id: 'cardio',
      name: 'Cardiovascular Health',
      icon: <HeartPulse className="w-5 h-5" />,
      inputs: [
        { name: 'blood_pressure', label: 'Blood Pressure (mmHg)', normalRange: [90, 120] },
        { name: 'cholesterol', label: 'Cholesterol (mg/dL)', normalRange: [0, 200] },
        { name: 'hdl', label: 'HDL (mg/dL)', normalRange: [40, 60] }
      ]
    },
    {
      id: 'liver',
      name: 'Liver Function',
      icon: <Syringe className="w-5 h-5" />,
      inputs: [
        { name: 'alt', label: 'ALT (U/L)', normalRange: [7, 56] },
        { name: 'ast', label: 'AST (U/L)', normalRange: [10, 40] },
        { name: 'bilirubin', label: 'Bilirubin (mg/dL)', normalRange: [0.1, 1.2] }
      ]
    },
    {
      id: 'mental',
      name: 'Mental Wellness',
      icon: <Brain className="w-5 h-5" />,
      inputs: [
        { name: 'stress_level', label: 'Stress Level (1-10)', normalRange: [0, 3] },
        { name: 'sleep_quality', label: 'Sleep Quality (1-10)', normalRange: [7, 10] },
        { name: 'mood_score', label: 'Mood Score (1-10)', normalRange: [7, 10] }
      ]
    }
  ];

  const handleInputChange = (name, value) => {
    setInputValues(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const analyzeHealth = () => {
    // Simulate AI analysis
    const currentDomain = healthDomains.find(d => d.id === activeTab);
    const outOfRange = currentDomain.inputs.some(input => {
      const value = inputValues[input.name];
      return value < input.normalRange[0] || value > input.normalRange[1];
    });

    setPrediction({
      status: outOfRange ? 'warning' : 'safe',
      message: outOfRange 
        ? 'Potential risk detected. Consult your healthcare provider.' 
        : 'Values within normal range. Maintain healthy habits!'
    });
  };

  return (
    <div className="ai-predictions">
      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
        <div className="container">
          <div className="hero-content">
            <div className="badge">
              <ShieldCheck className="w-4 h-4" />
              AI-Powered Health Insights
            </div>
            <h1>
              Proactive Health <span>Predictions</span>
            </h1>
            <p>
              Our advanced AI analyzes your health metrics to identify potential risks before they become serious.
              Get instant insights based on clinical data and research.
            </p>
            <div className="stats">
              <div className="stat">
                <div>95%</div>
                <span>Accuracy</span>
              </div>
              <div className="stat">
                <div>10K+</div>
                <span>Data Points</span>
              </div>
              <div className="stat">
                <div>4</div>
                <span>Health Domains</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="ai-visualization">
              <div className="network"></div>
              <div className="pulse"></div>
              <div className="data-points">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="point" style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`
                  }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction Interface */}
      <section className="prediction-interface">
        <div className="container">
          <div className="tabs">
            {healthDomains.map(domain => (
              <button
                key={domain.id}
                className={`tab ${activeTab === domain.id ? 'active' : ''}`}
                onClick={() => setActiveTab(domain.id)}
              >
                {domain.icon}
                {domain.name}
              </button>
            ))}
          </div>

          <div className="prediction-card">
            <div className="input-section">
              <h3>Enter Your Health Metrics</h3>
              {healthDomains.find(d => d.id === activeTab).inputs.map(input => (
                <div key={input.name} className="input-group">
                  <label>{input.label}</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={inputValues[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      placeholder={`Normal: ${input.normalRange[0]} - ${input.normalRange[1]}`}
                    />
                    <span className="unit">{input.label.includes('(') ? input.label.split('(')[1].split(')')[0] : ''}</span>
                  </div>
                  <div className="range-indicator">
                    <div className="track">
                      <div 
                        className="thumb"
                        style={{
                          left: `${Math.min(100, Math.max(0, 
                            ((inputValues[input.name] || 0) - input.normalRange[0]) / 
                            (input.normalRange[1] - input.normalRange[0]) * 100
                          ))}%`
                        }}
                      ></div>
                    </div>
                    <div className="range-labels">
                      <span>{input.normalRange[0]}</span>
                      <span>Normal Range</span>
                      <span>{input.normalRange[1]}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="analyze-button" onClick={analyzeHealth}>
                Analyze My Health
              </button>
            </div>

            <div className="result-section">
              <h3>AI Health Prediction</h3>
              {prediction ? (
                <div className={`prediction-result ${prediction.status}`}>
                  <div className="result-icon">
                    {prediction.status === 'safe' ? (
                      <ShieldCheck className="w-10 h-10" />
                    ) : (
                      <AlertTriangle className="w-10 h-10" />
                    )}
                  </div>
                  <h4>
                    {prediction.status === 'safe' ? 'Healthy Range' : 'Potential Risk Detected'}
                  </h4>
                  <p>{prediction.message}</p>
                  <div className="confidence-meter">
                    <div className="meter-track">
                      <div 
                        className="meter-fill"
                        style={{ width: prediction.status === 'safe' ? '85%' : '65%' }}
                      ></div>
                    </div>
                    <span>AI Confidence: {prediction.status === 'safe' ? '85%' : '65%'}</span>
                  </div>
                  {prediction.status === 'warning' && (
                    <button className="recommendation-button">
                      View Recommended Actions
                    </button>
                  )}
                </div>
              ) : (
                <div className="prediction-prompt">
                  <div className="pulse-animation">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                  </div>
                  <h4>Awaiting Analysis</h4>
                  <p>
                    Enter your health metrics and click "Analyze" to receive your 
                    personalized health prediction.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How Our AI Prediction Engine Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Data Collection</h3>
                <p>
                  Trained on thousands of anonymized medical records from verified sources including 
                  Kaggle medical datasets and clinical studies.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Advanced Processing</h3>
                <p>
                  Our models use feature engineering, normalization, and advanced preprocessing 
                  to ensure accurate analysis of your inputs.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Machine Learning Models</h3>
                <p>
                  Combination of logistic regression, decision trees, and neural networks provide 
                  robust predictions with explainable results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer">
        <div className="container">
          <div className="disclaimer-card">
            <AlertTriangle className="w-6 h-6" />
            <p>
              <strong>Important:</strong> These predictions are for informational purposes only and 
              should not replace professional medical advice. Always consult with a healthcare provider 
              for medical concerns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}