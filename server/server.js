const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const axios = require('axios');
const { Server } = require('socket.io');
const http = require('http');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const setupWebSocket = require('./websocket');

// Load environment variables first
dotenv.config();

// Create express app
const app = express();
const server = http.createServer(app);

setupWebSocket(server); 

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HealthVerse',
    ttl: 14 * 24 * 60 * 60 // = 14 days
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

// Initialize Passport before routes
require('./config/passport')(passport);

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HealthVerse')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://medixpert.netlify.app'], // ✅ ADD Netlify URL here
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://medixpert.netlify.app'], // ✅ ADD Netlify URL here too
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Attach Socket.IO for video calls
require('./video-socket')(io);

// Handle note events
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('addNote', async ({ recordId, content, userId }) => {
    try {
      const note = {
        recordId,
        content,
        doctorId: userId,
        createdAt: new Date()
      };
      io.emit('noteAdded', { recordId, note });
    } catch (err) {
      console.error('Error saving note:', err);
    }
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/users', userRoutes);
app.use('/api/video', videoRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// AI Prediction Endpoint
app.post('/api/ai/predict-risk', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/api/ai/predict-risk', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers['authorization'] || ''
      },
      timeout: 5000
    });
    res.json(response.data);
  } catch (error) {
    console.error('Flask Service Error:', error.message);
    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'Prediction service error',
      message: error.response?.data?.error || error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'up' : 'down',
      flask: 'http://localhost:5001'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server Startup
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});