/**
 * Database Configuration (MongoDB + Mongoose)
 *
 * NOTE: MongoDB is prepared here, but NOT connected by default.
 * When you are ready to connect MongoDB Atlas:
 * 1. Create a `.env` file in the `backend/` folder based on `.env.example`.
 * 2. Set MONGO_URI to your MongoDB Atlas connection string.
 * 3. Uncomment/call connectDB() in server.js.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log('---------------------------------------------------------');
    console.log('ℹ️  INFO: MongoDB URI is not set in environment variables.');
    console.log('📦 Running with IN-MEMORY temporary data store.');
    console.log('👉 To connect MongoDB later, add MONGO_URI in backend/.env');
    console.log('---------------------------------------------------------');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️ Falling back to IN-MEMORY data store for seamless operation.');
    return false;
  }
};

module.exports = connectDB;
