import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable");
}

// Modify global mongoose object to store cached connection
let cached = global.mongoose || { conn: null, promise: null };

// Store whether event listeners are attached already
let listenersAttached = false;

export async function dbConnect() {
  // For debugging: log connection status
  console.log(`MongoDB connection status: ${mongoose.connection.readyState}`);
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting

  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  // Set mongoose options
  mongoose.set('strictQuery', true);
  
  // Increase max event listeners to avoid warning
  mongoose.connection.setMaxListeners(25);

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

    // Only attach event listeners once
    if (!listenersAttached) {
      // Remove any existing listeners to prevent duplication
      mongoose.connection.removeAllListeners('error');
      mongoose.connection.removeAllListeners('disconnected');
      mongoose.connection.removeAllListeners('reconnected');
      
      // Set up connection event listeners for debugging
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
        cached.conn = null;
        cached.promise = null;
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });
      
      listenersAttached = true;
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Database connected successfully");
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
    
    // Update global cached object
    global.mongoose = cached;
    
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

// Function to close connections (useful for testing)
export async function dbDisconnect() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}
