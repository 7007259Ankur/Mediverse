import React, { useState } from 'react';

export default function MentalHealthForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    Age: '',
    Gender: 0,
    family_history: 0,
    work_interfere: 0,
    remote_work: 0,
    tech_company: 0
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'radio' || type === 'number' ? parseInt(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
          🧠
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Mental Health Assessment</h3>
        <p className="text-gray-600 mt-2">Complete this form to evaluate your mental health risk</p>
      </div>

      <div className="space-y-6">
        {/* Age Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Age</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min="18"
            max="100"
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Gender</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.Gender === 1 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="Gender"
                value={1}
                checked={formData.Gender === 1}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.Gender === 0 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="Gender"
                value={0}
                checked={formData.Gender === 0}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>

        {/* Family History */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Family History of Mental Illness</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.family_history === 1 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="family_history"
                value={1}
                checked={formData.family_history === 1}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.family_history === 0 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="family_history"
                value={0}
                checked={formData.family_history === 0}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Work Interference */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Work Interferes with Mental Health</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.work_interfere === 1 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="work_interfere"
                value={1}
                checked={formData.work_interfere === 1}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.work_interfere === 0 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="work_interfere"
                value={0}
                checked={formData.work_interfere === 0}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Remote Work */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Remote Work</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.remote_work === 1 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="remote_work"
                value={1}
                checked={formData.remote_work === 1}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.remote_work === 0 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="remote_work"
                value={0}
                checked={formData.remote_work === 0}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Tech Company */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Works in a Tech Company</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.tech_company === 1 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="tech_company"
                value={1}
                checked={formData.tech_company === 1}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.tech_company === 0 ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="tech_company"
                value={0}
                checked={formData.tech_company === 0}
                onChange={handleChange}
                className="hidden"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Predict Mental Health Risk'
          )}
        </button>
      </div>
    </form>
  );
}