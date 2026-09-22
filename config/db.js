import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }
  // const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/my_portfolio';
  const uri = process.env.MONGODB_URI ;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    if (uri !== 'mongodb://127.0.0.1:27017/my_portfolio') {
      try {
        console.log('[MongoDB] Remote URI unavailable, attempting local MongoDB (127.0.0.1:27017)...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/my_portfolio', {
          serverSelectionTimeoutMS: 2000,
        });
        isConnected = true;
        console.log(`[MongoDB] Connected successfully to local host: ${localConn.connection.host}`);
        return true;
      } catch {
        // Continue to fallback
      }
    }
    isConnected = false;
    console.warn(`[MongoDB Notice] Database connection not established (${error.message}).`);
    console.warn(`[MongoDB Notice] Server is running with auto-sync in-memory caching for seamless local preview.`);
    return false;
  }
};

export const getDBStatus = () => isConnected;
