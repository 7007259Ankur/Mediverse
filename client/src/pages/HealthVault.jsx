import React, { useState } from 'react';
import { uploadRecord } from '../services/vaultService';
import { useSelector } from 'react-redux';

const HealthVault = () => {
  const [file, setFile] = useState(null);
  const { token } = useSelector(state => state.auth);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadRecord(formData, token);
      alert('Record uploaded and processed successfully!');
      console.log(res);
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Health Record</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default HealthVault;
