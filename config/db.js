import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/my_portfolio';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Notice] Database connection not established (${error.message}).`);
    console.warn(`[MongoDB Notice] Server is running with auto-sync in-memory caching for seamless local preview.`);
    return false;
  }
};

export const getDBStatus = () => isConnected;
