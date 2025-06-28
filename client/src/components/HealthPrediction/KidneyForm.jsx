import React, { useState } from 'react';

export default function KidneyForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    age: '',
    bp: '',
    sg: '',
    al: '',
    su: '',
    bgr: '',
    bu: '',
    sc: '',
    sod: '',
    pot: '',
    hemo: '',
    pcv: '',
    htn: 0,
    dm: 0,
    cad: 0
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;

    if (type === 'number') val = parseFloat(value);
    if (type === 'radio') val = parseInt(value);

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">
        Kidney Disease Risk Assessment
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <label className="block font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Blood Pressure */}
        <div>
          <label className="block font-medium mb-1">Blood Pressure (mm Hg)</label>
          <input
            type="number"
            name="bp"
            value={formData.bp}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Specific Gravity */}
        <div>
          <label className="block font-medium mb-1">Specific Gravity</label>
          <input
            type="number"
            step="0.01"
            name="sg"
            value={formData.sg}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Albumin */}
        <div>
          <label className="block font-medium mb-1">Albumin</label>
          <input
            type="number"
            name="al"
            value={formData.al}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Sugar */}
        <div>
          <label className="block font-medium mb-1">Sugar</label>
          <input
            type="number"
            name="su"
            value={formData.su}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Blood Glucose Random */}
        <div>
          <label className="block font-medium mb-1">Blood Glucose Random (mg/dL)</label>
          <input
            type="number"
            name="bgr"
            value={formData.bgr}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Blood Urea */}
        <div>
          <label className="block font-medium mb-1">Blood Urea (mg/dL)</label>
          <input
            type="number"
            name="bu"
            value={formData.bu}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Serum Creatinine */}
        <div>
          <label className="block font-medium mb-1">Serum Creatinine (mg/dL)</label>
          <input
            type="number"
            step="0.01"
            name="sc"
            value={formData.sc}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Sodium */}
        <div>
          <label className="block font-medium mb-1">Sodium (mEq/L)</label>
          <input
            type="number"
            step="0.1"
            name="sod"
            value={formData.sod}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Potassium */}
        <div>
          <label className="block font-medium mb-1">Potassium (mEq/L)</label>
          <input
            type="number"
            step="0.1"
            name="pot"
            value={formData.pot}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Hemoglobin */}
        <div>
          <label className="block font-medium mb-1">Hemoglobin (g/dL)</label>
          <input
            type="number"
            step="0.1"
            name="hemo"
            value={formData.hemo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Packed Cell Volume */}
        <div>
          <label className="block font-medium mb-1">Packed Cell Volume (%)</label>
          <input
            type="number"
            name="pcv"
            value={formData.pcv}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Hypertension */}
        <div>
          <label className="block font-medium mb-1">Hypertension</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="htn"
                value={1}
                checked={formData.htn === 1}
                onChange={handleChange}
                className="cursor-pointer"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="htn"
                value={0}
                checked={formData.htn === 0}
                onChange={handleChange}
                className="cursor-pointer"
              />
              No
            </label>
          </div>
        </div>

        {/* Diabetes Mellitus */}
        <div>
          <label className="block font-medium mb-1">Diabetes Mellitus</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dm"
                value={1}
                checked={formData.dm === 1}
                onChange={handleChange}
                className="cursor-pointer"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dm"
                value={0}
                checked={formData.dm === 0}
                onChange={handleChange}
                className="cursor-pointer"
              />
              No
            </label>
          </div>
        </div>

        {/* Coronary Artery Disease */}
        <div>
          <label className="block font-medium mb-1">Coronary Artery Disease</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cad"
                value={1}
                checked={formData.cad === 1}
                onChange={handleChange}
                className="cursor-pointer"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cad"
                value={0}
                checked={formData.cad === 0}
                onChange={handleChange}
                className="cursor-pointer"
              />
              No
            </label>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-semibold shadow-md transition duration-200
            ${loading ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {loading ? 'Predicting...' : 'Predict Kidney Risk'}
        </button>
      </div>
    </form>
  );
}