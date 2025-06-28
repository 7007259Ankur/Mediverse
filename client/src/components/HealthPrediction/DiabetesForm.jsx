// import React, { useState } from 'react';

// export default function DiabetesForm({ onSubmit }) {
//   const [formData, setFormData] = useState({
//     Pregnancies: '',
//     Glucose: '',
//     BloodPressure: '',
//     SkinThickness: '',
//     Insulin: '',
//     BMI: '',
//     DiabetesPedigreeFunction: '',
//     Age: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <h3 className="text-xl font-semibold mb-4">Diabetes Risk Assessment</h3>

//       <div>
//         <label>Pregnancies:</label>
//         <input
//           type="number"
//           name="Pregnancies"
//           value={formData.Pregnancies}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label>Glucose:</label>
//         <input
//           type="number"
//           name="Glucose"
//           value={formData.Glucose}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label>Blood Pressure:</label>
//         <input
//           type="number"
//           name="BloodPressure"
//           value={formData.BloodPressure}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label>Skin Thickness:</label>
//         <input
//           type="number"
//           name="SkinThickness"
//           value={formData.SkinThickness}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label>Insulin:</label>
//         <input
//           type="number"
//           name="Insulin"
//           value={formData.Insulin}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label>BMI:</label>
//         <input
//           type="number"
//           step="0.1"
//           name="BMI"
//           value={formData.BMI}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label>Diabetes Pedigree Function:</label>
//         <input
//           type="number"
//           step="0.01"
//           name="DiabetesPedigreeFunction"
//           value={formData.DiabetesPedigreeFunction}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label>Age:</label>
//         <input
//           type="number"
//           name="Age"
//           value={formData.Age}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//       >
//         Predict Diabetes Risk
//       </button>
//     </form>
//   );
// }


import React, { useState } from 'react';

export default function DiabetesForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200"
    >
      <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">
        🩺 Diabetes Risk Assessment
      </h3>

      {[
        { label: 'Pregnancies', name: 'Pregnancies' },
        { label: 'Glucose', name: 'Glucose' },
        { label: 'Blood Pressure', name: 'BloodPressure' },
        { label: 'Skin Thickness', name: 'SkinThickness' },
        { label: 'Insulin', name: 'Insulin' },
        { label: 'BMI', name: 'BMI', step: '0.1' },
        { label: 'Diabetes Pedigree Function', name: 'DiabetesPedigreeFunction', step: '0.01' },
        { label: 'Age', name: 'Age' }
      ].map(({ label, name, step }) => (
        <div key={name}>
          <label className="block text-gray-700 font-medium mb-1">{label}</label>
          <input
            type="number"
            name={name}
            value={formData[name]}
            step={step}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md"
      >
        Predict Diabetes Risk
      </button>
    </form>
  );
}
