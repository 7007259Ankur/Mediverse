const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const User = require('../models/User');
const { uploadHealthRecord, getAllUserRecords } = require('../controllers/recordController');
const { upload, handleUploadErrors } = require('../middlewares/uploadMiddleware');
const auth = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// File upload
router.post(
  '/upload',
  auth,
  upload.single('file'),
  handleUploadErrors,
  uploadHealthRecord
);

// Get all records (doctor view)
router.get('/all-records', auth, getAllUserRecords);

// Get user records
router.get('/:userId', auth, async (req, res) => {
  try {
    const records = await Record.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('doctorNotes.doctorId', 'name email')
      .select('-__v');
    res.json(records);
  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  }
});

// Generate temporary file access token
router.get('/file-token/:recordId', auth, async (req, res) => {
  try {
    const record = await Record.findById(req.params.recordId);
    if (!record) return res.status(404).json({ error: 'Record not found' });

    // Verify access rights
    if (req.user.role === 'user' && record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create short-lived token (10 minutes)
    const token = jwt.sign(
      { 
        id: req.user._id,
        role: req.user.role,
        recordId: req.params.recordId,
        purpose: 'file_access' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// File download endpoint
router.get('/file/:id', async (req, res) => {
  try {
    const token = req.query.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== 'file_access') {
      return res.status(403).json({ error: 'Invalid token purpose' });
    }

    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });

    // Additional verification
    if (decoded.recordId !== req.params.id) {
      return res.status(403).json({ error: 'Token not valid for this file' });
    }

    const fullPath = path.join(__dirname, '../', record.filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        error: 'File not found',
        details: `Expected at: ${fullPath}`
      });
    }

    res.sendFile(fullPath, {
      headers: {
        'Content-Type': record.fileType,
        'Content-Disposition': `inline; filename="${record.filename}"`
      }
    });
  } catch (err) {
    console.error('File access error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Failed to access file' });
  }
});

// Notes endpoints
router.post('/:id/notes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can add notes' });
    }

    const record = await Record.findByIdAndUpdate(
      req.params.id,
      { $push: { doctorNotes: { doctorId: req.user._id, note: req.body.note } } },
      { new: true }
    ).populate('doctorNotes.doctorId', 'name email');

    res.json(record.doctorNotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/notes', auth, async (req, res) => {
  try {
    const record = await Record.findById(req.params.id)
      .populate('doctorNotes.doctorId', 'name email');
    res.json(record.doctorNotes || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;