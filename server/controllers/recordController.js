const User = require('../models/User');
const Record = require('../models/Record');
const path = require('path');

const uploadHealthRecord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create consistent relative path
    const relativePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
    
    const newRecord = new Record({
      userId: req.user._id,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      text: 'Uploaded file',
      filePath: relativePath, // Store consistent relative path
    });

    await newRecord.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: newRecord
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      error: 'File upload failed',
      details: err.message,
    });
  }
};

const getAllUserRecords = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied: Doctors only' });
    }

    const users = await User.find({ role: 'user' }).lean();
    const result = await Promise.all(users.map(async (user) => {
      const records = await Record.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .lean();
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        records,
      };
    }));

    res.status(200).json({ patients: result });
  } catch (err) {
    console.error('Error in getAllUserRecords:', err);
    res.status(500).json({
      error: 'Failed to retrieve users and records',
      details: err.message,
    });
  }
};

const getUserRecordsById = async (req, res) => {
  try {
    const { uid } = req.params;

    // If patient is trying to access someone else's data → block it
    if (req.user.role === 'user' && req.user._id.toString() !== uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const records = await Record.find({ userId: uid }).sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching user records:', err);
    res.status(500).json({
      error: 'Failed to retrieve user records',
      details: err.message
    });
  }
};


module.exports = {
  uploadHealthRecord,
  getAllUserRecords,
  getUserRecordsById,
};