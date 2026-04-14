DOMAIN_CONFIG = {
    'diabetes': {
        'features': ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
                    'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'],
        'threshold': 0.5
    },
    'cardiovascular': {
        'features': ['male', 'age', 'currentSmoker', 'cigsPerDay', 'totChol',
                    'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose'],
        'threshold': 0.5
    },
    'liver': {
        'features': ['Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin',
                    'Alkaline_Phosphotase', 'Alamine_Aminotransferase',
                    'Aspartate_Aminotransferase', 'Total_Proteins', 'Albumin',
                    'Albumin_and_Globulin_Ratio'],
        'threshold': 0.5
    },
    'kidney': {
        'features': ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod',
                    'pot', 'hemo', 'pcv', 'htn', 'dm', 'cad'],
        'threshold': 0.5
    },
    'mentalhealth': {
        'features': ['Age', 'Gender', 'family_history', 'work_interfere',
                    'remote_work', 'tech_company'],
        'threshold': 0.5
    }
}