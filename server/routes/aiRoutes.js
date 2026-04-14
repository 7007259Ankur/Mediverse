const express = require('express');
const axios = require('axios');
const router = express.Router();

const AI_SERVICE_URL = 'http://localhost:5001/api/ai/predict-risk';  // Full correct path
router.post('/predict-risk', async (req, res) => {
  try {
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No input data provided'
      });
    }

    // Forward to Flask service with timeout
    const response = await axios.post(AI_SERVICE_URL, req.body, {
      timeout: 10000 // 10 seconds timeout
    });

    // Validate response structure
    if (!response.data || typeof response.data.risk_score === 'undefined') {
      throw new Error('Invalid response structure from AI service');
    }

    // Successful response
    res.json({
      success: true,
      risk_score: response.data.risk_score,
      risk_level: response.data.risk_level,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    
    // Determine appropriate status code
    const statusCode = error.response?.status || 
                      error.code === 'ECONNABORTED' ? 504 : 500;

    res.status(statusCode).json({
      success: false,
      error: 'Prediction service error',
      message: error.response?.data?.error || error.message,
      ...(process.env.NODE_ENV === 'development' && {
        details: error.stack
      })
    });
  }
});

module.exports = router;