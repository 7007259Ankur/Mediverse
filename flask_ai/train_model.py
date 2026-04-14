import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.losses import MeanSquaredError
from sklearn.preprocessing import MinMaxScaler
import joblib
import tensorflow as tf
import os

# Generate synthetic health data
np.random.seed(42)
num_samples = 1000

data = {
    'age': np.random.randint(20, 80, num_samples),
    'blood_pressure': np.random.randint(80, 180, num_samples),
    'cholesterol': np.random.randint(150, 300, num_samples),
    'bmi': np.random.uniform(18, 40, num_samples),
    'is_smoker': np.random.choice([0, 1], num_samples),
    'is_diabetic': np.random.choice([0, 1], num_samples),
    'risk_score': np.random.uniform(0, 1, num_samples)
}

df = pd.DataFrame(data)

# Save sample data
os.makedirs('flask_ai', exist_ok=True)
df.to_csv('flask_ai/sample_health_data.csv', index=False)

# Scale features
numerical_cols = ['age', 'blood_pressure', 'cholesterol', 'bmi']
categorical_cols = ['is_smoker', 'is_diabetic']

scaler = MinMaxScaler()
df[numerical_cols] = scaler.fit_transform(df[numerical_cols])

joblib.dump(scaler, 'flask_ai/scaler.save')

# Prepare LSTM input
X = []
y = []
for i in range(5, len(df)):
    X.append(df.iloc[i-5:i][numerical_cols + categorical_cols].values)
    y.append(df.iloc[i]['risk_score'])

X = np.array(X)
y = np.array(y)

# Define and train model
model = Sequential([
    LSTM(32, input_shape=(5, len(numerical_cols + categorical_cols))),
    Dense(1, activation='sigmoid')
])


model.compile(optimizer='adam', loss=MeanSquaredError()) 
model.fit(X, y, epochs=20, batch_size=32, validation_split=0.2)

model.save('flask_ai/lstm_model.h5')
print("Model trained and saved successfully!")
