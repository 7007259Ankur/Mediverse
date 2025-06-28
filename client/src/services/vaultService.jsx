import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const uploadRecord = async (formData, token) => {
  const res = await axios.post(`${API_BASE_URL}/api/records/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAllRecords = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/records/all-records`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching records:', err);
    throw new Error(err.response?.data?.error || 'Failed to fetch records');
  }
};
