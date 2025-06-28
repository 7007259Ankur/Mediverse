// import React, { useState } from 'react';

// export default function LiverForm({ onSubmit }) {
//   const [formData, setFormData] = useState({
//     Age: '',
//     Gender: 0,
//     Total_Bilirubin: '',
//     Direct_Bilirubin: '',
//     Alkaline_Phosphotase: '',
//     Alamine_Aminotransferase: '',
//     Aspartate_Aminotransferase: '',
//     Total_Proteins: '',
//     Albumin: '',
//     Albumin_and_Globulin_Ratio: ''
//   });

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     let val = value;

//     if (type === 'number') {
//       val = parseFloat(value);
//     }

//     if (type === 'radio') {
//       val = parseInt(value);
//     }

//     setFormData(prev => ({
//       ...prev,
//       [name]: val
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <h3 className="text-xl font-semibold mb-4">Liver Disease Prediction</h3>

//       <div>
//         <label>Age:</label>
//         <input
//           type="number"
//           name="Age"
//           value={formData.Age}
//           onChange={handleChange}
//           required
//           className="input"
//         />
//       </div>

//       <div>
//         <label className="block mb-1">Gender:</label>
//         <div className="space-x-4">
//           <label>
//             <input
//               type="radio"
//               name="Gender"
//               value={1}
//               checked={formData.Gender === 1}
//               onChange={handleChange}
//             /> Male
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="Gender"
//               value={0}
//               checked={formData.Gender === 0}
//               onChange={handleChange}
//             /> Female
//           </label>
//         </div>
//       </div>

//       <div>
//         <label>Total Bilirubin:</label>
//         <input
//           type="number"
//           step="any"
//           name="Total_Bilirubin"
//           value={formData.Total_Bilirubin}
//           onChange={handleChange}
//           className="input"
//         />
//       </div>

//       <div>
//         <label>Direct Bilirubin:</label>
//         <input
//           type="number"
//           step="any"
//           name="Direct_Bilirubin"
//           value={formData.Direct_Bilirubin}
//           onChange={handleChange}
//           className="input"
//         />
//       </div>

//       <div>
//         <label>Alkaline Phosphotase:</label>
//         <input
//           type="number"
//           name="Alkaline_Phosphotase"
//           value={formData.Alkaline_Phosphotase}
//           onChange={handleChange}
//           className="input"
//         />
//       </div>

//       <div>
//         <label>Alamine Aminotransferase:</label>
//         <input
//           type="number"
//           name="Alamine_Aminotransferase"
//           value={formData.Alamine_Aminotransferase}
//           onChange={handleChange}
//           className="input"
//         />
//       </div>

//       <div>
//         <label>Aspartate Aminotransferase:</label>
//         <input
//           type="number"
//           name="Aspartate_Aminotransferase"
//           value={formData.Aspartate_Aminotransferase}
//           onChange={handleChange}
//           className="input"
//         />
//       </div>

//       <div>
//         <label>Total Proteins:</label>
//         <input
//           type="number"
//           step="any"
//           name="Total_Proteins"
//           value={formData.Total_Proteins}
//           onChange={handleChange}
//           className="input"
//         />
//       </div>

//       <div>
//         <label>Albumin:</label>
//         <input
//           type="number"
//           step="any"
//           name="Albumin"
//           value={formData.Albumin}
//           onChange={handleChange}
//           className="input"
//         />
//       </div>

//       <div>
//         <label>Albumin and Globulin Ratio:</label>
//         <input
//           type="number"
//           step="any"
//           name="Albumin_and_Globulin_Ratio"
//           value={formData.Albumin_and_Globulin_Ratio}
//           onChange={handleChange}
//           className="input"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//       >
//         Predict Liver Risk
//       </button>
//     </form>
//   );
// }


import React, { useState } from 'react';

export default function LiverForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    Age: '',
    Gender: 0,
    Total_Bilirubin: '',
    Direct_Bilirubin: '',
    Alkaline_Phosphotase: '',
    Alamine_Aminotransferase: '',
    Aspartate_Aminotransferase: '',
    Total_Proteins: '',
    Albumin: '',
    Albumin_and_Globulin_Ratio: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;

    if (type === 'number') {
      val = parseFloat(value);
    }

    if (type === 'radio') {
      val = parseInt(value);
    }

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Liver Disease Prediction
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Age">Age:</label>
          <input
            id="Age"
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold mb-1">Gender:</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="Gender"
                value={1}
                checked={formData.Gender === 1}
                onChange={handleChange}
                className="cursor-pointer"
              />
              Male
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="Gender"
                value={0}
                checked={formData.Gender === 0}
                onChange={handleChange}
                className="cursor-pointer"
              />
              Female
            </label>
          </div>
        </div>

        {/* Total Bilirubin */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Total_Bilirubin">Total Bilirubin:</label>
          <input
            id="Total_Bilirubin"
            type="number"
            step="any"
            name="Total_Bilirubin"
            value={formData.Total_Bilirubin}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Direct Bilirubin */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Direct_Bilirubin">Direct Bilirubin:</label>
          <input
            id="Direct_Bilirubin"
            type="number"
            step="any"
            name="Direct_Bilirubin"
            value={formData.Direct_Bilirubin}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Alkaline Phosphotase */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Alkaline_Phosphotase">Alkaline Phosphotase:</label>
          <input
            id="Alkaline_Phosphotase"
            type="number"
            name="Alkaline_Phosphotase"
            value={formData.Alkaline_Phosphotase}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Alamine Aminotransferase */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Alamine_Aminotransferase">Alamine Aminotransferase:</label>
          <input
            id="Alamine_Aminotransferase"
            type="number"
            name="Alamine_Aminotransferase"
            value={formData.Alamine_Aminotransferase}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Aspartate Aminotransferase */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Aspartate_Aminotransferase">Aspartate Aminotransferase:</label>
          <input
            id="Aspartate_Aminotransferase"
            type="number"
            name="Aspartate_Aminotransferase"
            value={formData.Aspartate_Aminotransferase}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Total Proteins */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Total_Proteins">Total Proteins:</label>
          <input
            id="Total_Proteins"
            type="number"
            step="any"
            name="Total_Proteins"
            value={formData.Total_Proteins}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Albumin */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Albumin">Albumin:</label>
          <input
            id="Albumin"
            type="number"
            step="any"
            name="Albumin"
            value={formData.Albumin}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Albumin and Globulin Ratio */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="Albumin_and_Globulin_Ratio">
            Albumin and Globulin Ratio:
          </label>
          <input
            id="Albumin_and_Globulin_Ratio"
            type="number"
            step="any"
            name="Albumin_and_Globulin_Ratio"
            value={formData.Albumin_and_Globulin_Ratio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-semibold shadow-md transition duration-200
            ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Predicting...' : 'Predict Liver Risk'}
        </button>
      </div>
    </form>
  );
}

