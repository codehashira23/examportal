import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  // For debugging: log connection status
  console.log(`MongoDB connection status: ${mongoose.connection.readyState}`);
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting

  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(`Creating new database connection to: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    
    const opts = {
      // Additional MongoDB connection options
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Database connected successfully");
        
        // Set up connection event listeners for debugging
        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
          console.log('MongoDB reconnected');
        });
        
        return mongoose;
      })
      .catch((error) => {
        console.error("Database connection error:", error);
        cached.promise = null; // Reset promise so connection will be attempted again
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    
    // Ensure connection is healthy
    if (mongoose.connection.readyState !== 1) {
      console.warn(`MongoDB connection in unexpected state: ${mongoose.connection.readyState}`);
      // Force reconnect if not connected
      cached.promise = null;
      cached.conn = null;
      return dbConnect(); // Retry connection
    }
    
    return cached.conn;
  } catch (error) {
    console.error("Error in dbConnect:", error);
    // Reset cached connection on error to force a new connection attempt next time
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

// Helper function to check if connection is healthy
export function isConnected() {
  return mongoose.connection.readyState === 1;
}
