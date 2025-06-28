// import React, { useState } from 'react';

// export default function CardiovascularForm({ onSubmit, loading }) {
//   const [formData, setFormData] = useState({
//     male: 0,
//     age: '',
//     currentSmoker: 0,
//     cigsPerDay: '',
//     totChol: '',
//     sysBP: '',
//     diaBP: '',
//     BMI: '',
//     heartRate: '',
//     glucose: ''
//   });

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     let val = value;

//     if (type === 'number') val = parseFloat(value);
//     if (type === 'radio') val = parseInt(value);

//     setFormData((prev) => ({
//       ...prev,
//       [name]: val
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
//         Cardiovascular Risk Assessment
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Gender */}
//         <div>
//           <label className="block font-medium mb-1">Gender</label>
//           <div className="flex gap-4">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name="male"
//                 value={1}
//                 checked={formData.male === 1}
//                 onChange={handleChange}
//               />
//               Male
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name="male"
//                 value={0}
//                 checked={formData.male === 0}
//                 onChange={handleChange}
//               />
//               Female
//             </label>
//           </div>
//         </div>

//         {/* Age */}
//         <div>
//           <label className="block font-medium mb-1">Age</label>
//           <input
//             type="number"
//             name="age"
//             value={formData.age}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Smoker */}
//         <div>
//           <label className="block font-medium mb-1">Are you a current smoker?</label>
//           <div className="flex gap-4">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name="currentSmoker"
//                 value={1}
//                 checked={formData.currentSmoker === 1}
//                 onChange={handleChange}
//               />
//               Yes
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name="currentSmoker"
//                 value={0}
//                 checked={formData.currentSmoker === 0}
//                 onChange={handleChange}
//               />
//               No
//             </label>
//           </div>
//         </div>

//         {/* Cigs per day */}
//         <div>
//           <label className="block font-medium mb-1">Cigarettes Per Day</label>
//           <input
//             type="number"
//             name="cigsPerDay"
//             value={formData.cigsPerDay}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Total Cholesterol */}
//         <div>
//           <label className="block font-medium mb-1">Total Cholesterol (mg/dL)</label>
//           <input
//             type="number"
//             name="totChol"
//             value={formData.totChol}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Systolic BP */}
//         <div>
//           <label className="block font-medium mb-1">Systolic Blood Pressure</label>
//           <input
//             type="number"
//             name="sysBP"
//             value={formData.sysBP}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Diastolic BP */}
//         <div>
//           <label className="block font-medium mb-1">Diastolic Blood Pressure</label>
//           <input
//             type="number"
//             name="diaBP"
//             value={formData.diaBP}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* BMI */}
//         <div>
//           <label className="block font-medium mb-1">BMI</label>
//           <input
//             type="number"
//             name="BMI"
//             value={formData.BMI}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Heart Rate */}
//         <div>
//           <label className="block font-medium mb-1">Heart Rate</label>
//           <input
//             type="number"
//             name="heartRate"
//             value={formData.heartRate}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Glucose */}
//         <div>
//           <label className="block font-medium mb-1">Glucose Level</label>
//           <input
//             type="number"
//             name="glucose"
//             value={formData.glucose}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>
//       </div>

//       <div className="text-center pt-4">
//         <button
//           type="submit"
//           disabled={loading}
//           className={`px-6 py-2 text-white font-semibold rounded-lg shadow-md transition duration-200
//             ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//         >
//           {loading ? "Predicting..." : "Predict Risk"}
//         </button>
//       </div>
//     </form>
//   );
// }

import React, { useState } from 'react';

export default function CardiovascularForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    male: 0,
    age: '',
    currentSmoker: 0,
    cigsPerDay: '',
    totChol: '',
    sysBP: '',
    diaBP: '',
    BMI: '',
    heartRate: '',
    glucose: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;

    if (type === 'number') val = parseFloat(value);
    if (type === 'radio') val = parseInt(value);

    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8"
      noValidate
    >
      <h3 className="text-3xl font-extrabold text-center text-blue-800 tracking-wide mb-6">
        Cardiovascular Risk Assessment
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gender */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Gender</label>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="male"
                value={1}
                checked={formData.male === 1}
                onChange={handleChange}
                className="form-radio text-teal-600"
              />
              Male
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="male"
                value={0}
                checked={formData.male === 0}
                onChange={handleChange}
                className="form-radio text-teal-600"
              />
              Female
            </label>
          </div>
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block mb-2 font-semibold text-gray-700">
            Age
          </label>
          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min={0}
            placeholder="e.g., 45"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {/* Smoker */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Are you a current smoker?</label>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="currentSmoker"
                value={1}
                checked={formData.currentSmoker === 1}
                onChange={handleChange}
                className="form-radio text-teal-600"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="currentSmoker"
                value={0}
                checked={formData.currentSmoker === 0}
                onChange={handleChange}
                className="form-radio text-teal-600"
              />
              No
            </label>
          </div>
        </div>

        {/* Cigarettes Per Day */}
        <div>
          <label htmlFor="cigsPerDay" className="block mb-2 font-semibold text-gray-700">
            Cigarettes Per Day
          </label>
          <input
            id="cigsPerDay"
            type="number"
            name="cigsPerDay"
            value={formData.cigsPerDay}
            onChange={handleChange}
            min={0}
            placeholder="If smoker, enter number"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {/* Total Cholesterol */}
        <div>
          <label htmlFor="totChol" className="block mb-2 font-semibold text-gray-700">
            Total Cholesterol (mg/dL)
          </label>
          <input
            id="totChol"
            type="number"
            name="totChol"
            value={formData.totChol}
            onChange={handleChange}
            min={0}
            placeholder="e.g., 180"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {/* Systolic Blood Pressure */}
        <div>
          <label htmlFor="sysBP" className="block mb-2 font-semibold text-gray-700">
            Systolic Blood Pressure
          </label>
          <input
            id="sysBP"
            type="number"
            name="sysBP"
            value={formData.sysBP}
            onChange={handleChange}
            min={0}
            placeholder="e.g., 120"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {/* Diastolic Blood Pressure */}
        <div>
          <label htmlFor="diaBP" className="block mb-2 font-semibold text-gray-700">
            Diastolic Blood Pressure
          </label>
          <input
            id="diaBP"
            type="number"
            name="diaBP"
            value={formData.diaBP}
            onChange={handleChange}
            min={0}
            placeholder="e.g., 80"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {/* BMI */}
        <div>
          <label htmlFor="BMI" className="block mb-2 font-semibold text-gray-700">
            BMI
          </label>
          <input
            id="BMI"
            type="number"
            name="BMI"
            value={formData.BMI}
            onChange={handleChange}
            min={0}
            step="0.1"
            placeholder="e.g., 24.5"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {/* Heart Rate */}
        <div>
          <label htmlFor="heartRate" className="block mb-2 font-semibold text-gray-700">
            Heart Rate
          </label>
          <input
            id="heartRate"
            type="number"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            min={0}
            placeholder="e.g., 72"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {/* Glucose Level */}
        <div>
          <label htmlFor="glucose" className="block mb-2 font-semibold text-gray-700">
            Glucose Level
          </label>
          <input
            id="glucose"
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleChange}
            min={0}
            placeholder="e.g., 90"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 rounded-full font-semibold text-white shadow-lg transition-transform duration-300
            ${loading ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:scale-105 active:scale-95'}`}
        >
          {loading ? 'Predicting...' : 'Predict Risk'}
        </button>
      </div>
    </form>
  );
}
