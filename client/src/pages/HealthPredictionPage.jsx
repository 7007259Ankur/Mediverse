import React, { useState, useEffect } from 'react';
import DiabetesForm from '../components/HealthPrediction/DiabetesForm';
import CardiovascularForm from '../components/HealthPrediction/CardiovascularForm';
import LiverForm from '../components/HealthPrediction/LiverForm';
import KidneyForm from '../components/HealthPrediction/KidneyForm';
import MentalHealthForm from '../components/HealthPrediction/MentalHealthForm';
import ResultsDisplay from '../components/HealthPrediction/ResultsDisplay';

// Import real images for each domain
import diabetesImage from '../assets/Medical/diabetes.png';
import cardiovascularImage from '../assets/Medical/heart.png';
import liverImage from '../assets/Medical/liver.png';
import kidneyImage from '../assets/Medical/Kideny.png';
import mentalHealthImage from '../assets/Medical/mental-health.png';

import './HealthPrediction.css';

const domainComponents = {
    diabetes: DiabetesForm,
    cardiovascular: CardiovascularForm,
    liver: LiverForm,
    kidney: KidneyForm,
    mentalhealth: MentalHealthForm
};

const domainImages = {
    diabetes: diabetesImage,
    cardiovascular: cardiovascularImage,
    liver: liverImage,
    kidney: kidneyImage,
    mentalhealth: mentalHealthImage
};

const domainDescriptions = {
    diabetes: 'Assess your risk for diabetes with our comprehensive analysis',
    cardiovascular: 'Evaluate your heart health and cardiovascular risk factors',
    liver: 'Check your liver function and potential health concerns',
    kidney: 'Analyze kidney health and detect potential issues',
    mentalhealth: 'Assess your mental wellness and emotional health'
};

const domainColors = {
    diabetes: 'bg-blue-100 text-blue-800',
    cardiovascular: 'bg-red-100 text-red-800',
    liver: 'bg-green-100 text-green-800',
    kidney: 'bg-purple-100 text-purple-800',
    mentalhealth: 'bg-indigo-100 text-indigo-800'
};

function ErrorOverlay({ error, onRetry }) {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
                <button 
                    onClick={onRetry}
                    className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}
function HealthDomainCard({ domain, onSelect, isSelected, isLoading }) {
    return (
        <button
            onClick={() => !isLoading && onSelect(domain)}
            disabled={isLoading}
            className={`health-domain-card ${isSelected ? 'ring-4 ring-teal-500' : ''} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            <div className="health-domain-image-container">
                <img 
                    src={domainImages[domain]} 
                    alt={domain} 
                    className="health-domain-image"
                    loading="lazy"
                />
                <div className="health-domain-overlay">
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        domainColors[domain]
                    }`}>
                        {domain === 'diabetes' && 'Diabetes'}
                        {domain === 'cardiovascular' && 'Heart'}
                        {domain === 'liver' && 'Liver'}
                        {domain === 'kidney' && 'Kidney'}
                        {domain === 'mentalhealth' && 'Mental'}
                    </div>
                    <h3 className="text-xl font-bold capitalize mb-2">
                        {domain.replace(/([A-Z])/g, ' $1')}
                    </h3>
                    <p className="text-sm opacity-90 mb-2">
                        {domainDescriptions[domain]}
                    </p>
                    <div className="flex items-center text-sm font-medium">
                        <span>Start Assessment</span>
                    </div>
                </div>
            </div>
        </button>
    );
}

export default function HealthPredictionPage() {
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [domainConfig, setDomainConfig] = useState({});
    const [predictionResult, setPredictionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDomains = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/health-api/domains');
                if (!response.ok) {
                    throw new Error('Failed to load health domains');
                }
                const data = await response.json();
                setDomains(data.domains || ['diabetes', 'cardiovascular', 'liver', 'kidney', 'mentalhealth']);
                setDomainConfig(data.config || {});
            } catch (error) {
                console.error("Failed to load domains:", error);
                setError(error.message);
                setDomains(['diabetes', 'cardiovascular', 'liver', 'kidney', 'mentalhealth']);
                setDomainConfig({});
            } finally {
                setLoading(false);
            }
        };
        fetchDomains();
    }, []);

    const handleDomainSelect = (domain) => {
        setSelectedDomain(domain);
        setPredictionResult(null);
        setError(null);
    };

    const handleFormSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/health-api/predict/${selectedDomain}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Prediction failed. Please check your inputs.');
            }
            
            const result = await response.json();
            setPredictionResult(result);
        } catch (error) {
            console.error("Prediction error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const DomainForm = domainComponents[selectedDomain];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Health Risk Assessment</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Professional health evaluation powered by medical analytics and AI
                        </p>
                        <div className="w-24 h-1.5 bg-teal-500 mx-auto mt-6 rounded-full"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Domain Selection */}
                <section className="mb-12">
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Health Assessment</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {domains.map((domain) => (
                                <HealthDomainCard
                                    key={domain}
                                    domain={domain}
                                    onSelect={handleDomainSelect}
                                    isSelected={selectedDomain === domain}
                                    isLoading={loading}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                {selectedDomain && DomainForm && (
                    <section className="mb-12 animate-fadeIn">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 border-2 border-white shadow-md">
                                    <img 
                                        src={domainImages[selectedDomain]} 
                                        alt={selectedDomain}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 capitalize">
                                        {selectedDomain.replace(/([A-Z])/g, ' $1')} Assessment
                                    </h2>
                                    <p className="text-gray-600">{domainDescriptions[selectedDomain]}</p>
                                </div>
                            </div>

                            <DomainForm
                                fields={domainConfig[selectedDomain]?.features || []}
                                onSubmit={handleFormSubmit}
                                loading={loading}
                            />
                        </div>
                    </section>
                )}

                {/* Error Display */}
                {error && !loading && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {predictionResult && !loading && (
                    <section className="animate-fadeIn">
                        <ResultsDisplay
                            result={predictionResult}
                            domain={selectedDomain}
                            domainImage={domainImages[selectedDomain]}
                        />
                    </section>
                )}
            </main>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-xl font-medium text-gray-800">Processing Analysis</h3>
                        <p className="text-gray-600 mt-2">Please wait while we evaluate your data</p>
                        <p className="text-sm text-gray-500 mt-2 animate-pulse">This may take a few moments...</p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Health Prediction System. All rights reserved.</p>
                    <p className="mt-1">This tool is for informational purposes only and not a substitute for professional medical advice.</p>
                </div>
            </footer>
        </div>
    );
}