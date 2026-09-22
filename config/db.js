import mongoose from 'mongoose';

let isConnected = false;

/**
 * Builds the MongoDB connection string dynamically from environment variables
 */
const getMongoURI = () => {
  // 1. Prefer explicit full URI if provided
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI.trim();
  }

  // 2. Build dynamically from credentials
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD ? encodeURIComponent(process.env.DB_PASSWORD) : '';
  const host = process.env.DB_HOST;
  const dbName = process.env.DB_NAME || 'my_portfolio';
  const appName = process.env.DB_APP_NAME ? `?appName=${process.env.DB_APP_NAME}` : '';

  if (user && password && host) {
    return `mongodb+srv://${user}:${password}@${host}/${dbName}${appName}`;
  }

  // 3. Fallback to default local connection
  return `mongodb://127.0.0.1:27017/${dbName}`;
};

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = getMongoURI();
  const dbName = process.env.DB_NAME || 'my_portfolio';
  const localFallbackUri = `mongodb://127.0.0.1:27017/${dbName}`;

  if (process.env.VERCEL && uri.includes('127.0.0.1')) {
    console.error('[MongoDB Error] VERCEL environment detected but no valid MONGODB_URI provided. Please add MONGODB_URI to Vercel Environment Variables.');
    // We could throw here, but we will let it fail fast.
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Increased for serverless cold starts
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    if (process.env.VERCEL) {
      console.error(`[MongoDB Error] Failed to connect on Vercel: ${error.message}`);
      console.error(`[MongoDB Error] This is usually caused by MongoDB Atlas IP Whitelisting. Ensure you have added 0.0.0.0/0 (Allow Access from Anywhere) in your MongoDB Atlas Network Access settings.`);
      throw new Error(`Database connection failed: ${error.message}. Please check MongoDB IP Whitelist (add 0.0.0.0/0) and MONGODB_URI in Vercel.`);
    }
    
    // If remote connection failed, attempt local fallback
    if (uri !== localFallbackUri) {
      try {
        console.log(`[MongoDB] Remote URI unavailable, attempting local MongoDB (${localFallbackUri})...`);
        const localConn = await mongoose.connect(localFallbackUri, {
          serverSelectionTimeoutMS: 2000,
        });
        isConnected = true;
        console.log(`[MongoDB] Connected successfully to local host: ${localConn.connection.host} (DB: ${localConn.connection.name})`);
        return true;
      } catch {
        // Fallthrough to warning block
      }
    }

    isConnected = false;
    console.warn(`[MongoDB Notice] Database connection not established (${error.message}).`);
    console.warn(`[MongoDB Notice] Server is running with auto-sync in-memory caching for seamless local preview.`);
    return false;
  }
};

export const getDBStatus = () => isConnected;