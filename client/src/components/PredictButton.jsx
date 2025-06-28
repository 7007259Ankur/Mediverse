import { useNavigate } from 'react-router-dom';
import './PredictButton.css';

const PredictButton = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate('/predict')}
      className="predict-btn"
    >
      <div className="predict-btn-content">
        <svg 
          className="predict-icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
          />
        </svg>
        <span className="predict-text">Predict Health Risk</span>
      </div>
      <div className="predict-btn-glow"></div>
    </button>
  );
};

export default PredictButton;