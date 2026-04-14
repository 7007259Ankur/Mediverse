import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
from pathlib import Path
from .data_preparation import *  # Make sure all clean_<domain>_data functions are defined here
from .constants import DOMAIN_CONFIG

# Define path to save models
MODELS_DIR = Path(__file__).parent / "health_models"
MODELS_DIR.mkdir(exist_ok=True)

def train_model(domain):
    try:
        print(f"\nStarting {domain} model training...")
        clean_func = globals().get(f"clean_{domain}_data")
        if not clean_func:
            print(f"No cleaning function found for {domain}")
            return

        df = clean_func()
        print(f"Data cleaned. Shape: {df.shape}")

        features = DOMAIN_CONFIG[domain]['features']
        target_col = {
            'diabetes': 'Outcome',
            'cardiovascular': 'TenYearCHD',
            'liver': 'Target',
            'kidney': 'classification',
            'mentalhealth': 'treatment'
        }[domain]

        print(f"Using features: {features}")
        print(f"Target column: {target_col}")

        X = df[features]
        y = df[target_col]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        accuracy = model.score(X_test, y_test)
        joblib.dump(model, MODELS_DIR / f"{domain}_model.pkl")
        print(f"{domain} model trained successfully. Accuracy: {accuracy:.2f}")

    except Exception as e:
        print(f"Error training {domain} model:")
        print(f"Type: {type(e).__name__}")
        print(f"Message: {str(e)}")
        if 'df' in locals():
            print("\nData sample:")
            print(df.head())
            print("\nColumns available:")
            print(df.columns.tolist())

# Run training for all domains
if __name__ == "__main__":
    domains = ["cardiovascular", "liver", "kidney", "mentalhealth", "diabetes"]
    for domain in domains:
        train_model(domain)
