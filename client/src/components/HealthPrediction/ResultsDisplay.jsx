import React from 'react';

export default function ResultsDisplay({ result, domain }) {
    if (result.error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-700">{result.error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const riskPercentage = (result.risk_score * 100).toFixed(1);
    let riskColor, riskMessage, riskDescription;

    if (result.risk_level === 'high') {
        riskColor = 'bg-red-100 text-red-800';
        riskMessage = 'High Risk';
        riskDescription = 'Consult with a healthcare professional as soon as possible.';
    } else if (result.risk_level === 'medium') {
        riskColor = 'bg-yellow-100 text-yellow-800';
        riskMessage = 'Moderate Risk';
        riskDescription = 'Consider consulting with a healthcare professional for further evaluation.';
    } else {
        riskColor = 'bg-green-100 text-green-800';
        riskMessage = 'Low Risk';
        riskDescription = 'Continue with healthy habits and regular check-ups.';
    }

    const domainTitles = {
        diabetes: 'Diabetes Risk Assessment',
        cardiovascular: 'Cardiovascular Risk Assessment',
        liver: 'Liver Disease Risk Assessment',
        kidney: 'Kidney Disease Risk Assessment',
        mentalhealth: 'Mental Health Risk Assessment'
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
                <h3 className="text-xl font-semibold">
                    {domainTitles[domain] || `${domain.charAt(0).toUpperCase() + domain.slice(1)} Risk Assessment`}
                </h3>
            </div>
            
            <div className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-sm font-medium text-gray-500">Risk Score</p>
                        <p className="text-5xl font-bold text-gray-900">{riskPercentage}%</p>
                    </div>
                    
                    <div className={`px-6 py-3 rounded-full ${riskColor} font-semibold text-center`}>
                        {riskMessage}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Recommendations:</h4>
                    <p className="text-gray-600">{riskDescription}</p>
                    
                    {result.recommendations && (
                        <ul className="mt-2 list-disc list-inside text-gray-600">
                            {result.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        <strong>Note:</strong> This assessment is based on the information provided and should not replace professional medical advice.
                    </p>
                </div>
            </div>
        </div>
    );
}