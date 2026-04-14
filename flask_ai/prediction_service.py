from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import pandas as pd
import logging
import os
import tensorflow as tf
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:4000"], "supports_credentials": True}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'lstm_model.h5')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.save')

try:
    model = load_model(MODEL_PATH, compile=False) if os.path.exists(MODEL_PATH) else None
    scaler = joblib.load(SCALER_PATH)
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    model = None
    scaler = None

@app.route('/api/ai/predict-risk', methods=['POST'])
def predict():
    if not model or not scaler:
        return jsonify({
            "error": "Prediction service unavailable",
            "details": "Models not loaded"
        }), 503

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ['age', 'bloodPressure', 'cholesterol', 'bmi']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing": missing_fields
            }), 400

        input_data = pd.DataFrame([{
            'age': float(data['age']),
            'blood_pressure': float(data['bloodPressure']),
            'cholesterol': float(data['cholesterol']),
            'bmi': float(data['bmi']),
            'is_smoker': int(data.get('isSmoker', 0)),
            'is_diabetic': int(data.get('isDiabetic', 0))
        }])

        numerical_cols = ['age', 'blood_pressure', 'cholesterol', 'bmi']
        input_data[numerical_cols] = scaler.transform(input_data[numerical_cols])

        # Prepare dummy window of 5 same entries to match LSTM shape
        input_sequence = np.tile(input_data.values, (5, 1)).reshape(1, 5, -1)

        risk_score = float(model.predict(input_sequence)[0][0])
        risk_level = "Low" if risk_score < 0.3 else "Medium" if risk_score < 0.6 else "High"

        return jsonify({
            "risk_score": risk_score,
            "risk_level": risk_level,
            "status": "success"
        })

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({"error": "Invalid input values", "details": str(e)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
