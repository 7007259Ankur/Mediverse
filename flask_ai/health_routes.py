from flask import Blueprint, request, jsonify
import joblib
import numpy as np
from pathlib import Path
from .constants import DOMAIN_CONFIG
from .health_utils import validate_input

health_bp = Blueprint('health', __name__)
MODELS_DIR = Path(__file__).parent / "health_models"

# Load all models
models = {}
for domain in DOMAIN_CONFIG:
    try:
        models[domain] = joblib.load(MODELS_DIR / f"{domain}_model.pkl")
    except Exception as e:
        print(f"Error loading {domain} model: {str(e)}")

@health_bp.route('/domains', methods=['GET'])
def get_domains():
    return jsonify({
        'domains': list(DOMAIN_CONFIG.keys()),
        'config': {k: {'features': v['features']} for k,v in DOMAIN_CONFIG.items()}
    })

@health_bp.route('/predict/<domain>', methods=['POST'])
def predict(domain):
    if domain not in models:
        return jsonify({"error": "Invalid health domain"}), 400
    
    data = request.get_json()
    validation_result = validate_input(domain, data)
    if not validation_result['valid']:
        return jsonify({"error": validation_result['message']}), 400
    
    try:
        features = [float(data[field]) for field in DOMAIN_CONFIG[domain]['features']]
        prediction = models[domain].predict_proba([features])[0][1]
        
        return jsonify({
            "domain": domain,
            "risk_score": float(prediction),
            "risk_level": "high" if prediction > DOMAIN_CONFIG[domain]['threshold'] else "low",
            "features_used": DOMAIN_CONFIG[domain]['features']
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500
