import pandas as pd
from pathlib import Path
import numpy as np
from .constants import DOMAIN_CONFIG

DATA_DIR = Path(__file__).parent / "health_datasets"

def clean_diabetes_data():
    df = pd.read_csv(DATA_DIR / "diabetes.csv")
    df.fillna(0, inplace=True)
    return df

def clean_cardiovascular_data():  # Rename this to match what we're calling
    df = pd.read_csv(DATA_DIR / "framingham.csv")
    # Add proper cleaning here
    df.fillna({
        'glucose': df['glucose'].median(),
        'cigsPerDay': 0,
        'BPMeds': 0,
        'totChol': df['totChol'].median(),
        'BMI': df['BMI'].median(),
        'heartRate': df['heartRate'].median()
    }, inplace=True)
    return df

def clean_liver_data():
    df = pd.read_csv(DATA_DIR / "ilpd.csv", header=None)
    df.columns = ['Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin', 
                 'Alkaline_Phosphotase', 'Alamine_Aminotransferase', 
                 'Aspartate_Aminotransferase', 'Total_Proteins', 
                 'Albumin', 'Albumin_and_Globulin_Ratio', 'Target']
    
    # Proper gender encoding
    df['Gender'] = df['Gender'].apply(lambda x: 1 if x.lower() == 'male' else 0)
    
    # Fill missing values
    for col in df.columns:
        if df[col].dtype in ['float64', 'int64']:
            df[col].fillna(df[col].median(), inplace=True)
    
    return df

def clean_kidney_data():
    df = pd.read_csv(DATA_DIR / "kidney_disease.csv")
    
    # Clean special characters and convert to numeric
    numeric_cols = ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col].replace('\t?', np.nan).replace('?', np.nan), errors='coerce')
            df[col].fillna(df[col].median(), inplace=True)
    
    # Convert categorical columns
    cat_cols = ['htn', 'dm', 'cad']
    for col in cat_cols:
        if col in df.columns:
            df[col] = df[col].map({'yes': 1, 'no': 0}).fillna(0)
    
    # Target variable
    df['classification'] = df['classification'].apply(lambda x: 1 if 'ckd' in str(x).lower() else 0)
    
    return df

def clean_mentalhealth_data():
    df = pd.read_csv(DATA_DIR / "mental_wellness.csv")
    
    # Clean and encode gender
    df['Gender'] = df['Gender'].str.lower().str.strip()
    df['Gender'] = df['Gender'].apply(lambda x: 1 if x.startswith('m') else 0)
    
    # Encode other categorical variables
    df['family_history'] = df['family_history'].map({'Yes': 1, 'No': 0}).fillna(0)
    df['treatment'] = df['treatment'].map({'Yes': 1, 'No': 0}).fillna(0)
    
    # Work interfere - convert to ordinal
    work_map = {'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Often': 3}
    df['work_interfere'] = df['work_interfere'].map(work_map).fillna(0)
    
    # Binary features
    binary_features = ['remote_work', 'tech_company']
    for feat in binary_features:
        df[feat] = df[feat].map({'Yes': 1, 'No': 0}).fillna(0)
    
    # Drop irrelevant columns
    cols_to_keep = ['Age', 'Gender', 'family_history', 'work_interfere', 
                   'remote_work', 'tech_company', 'treatment']
    df = df[cols_to_keep].copy()
    
    return df