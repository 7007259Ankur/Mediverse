const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    // Verify connection
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('🗃️ Available collections:', collections.map(c => c.name));
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Enhanced event listeners
mongoose.connection.on('connecting', () => console.log('🔗 Connecting to MongoDB...'));
mongoose.connection.on('connected', () => console.log('✅ Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('❌ Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('⚠️ Mongoose disconnected'));

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;