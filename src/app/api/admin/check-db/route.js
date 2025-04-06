import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Try to connect to the database
    await dbConnect();
    
    const connectionState = mongoose.connection.readyState;
    
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const stateText = ['disconnected', 'connected', 'connecting', 'disconnecting'][connectionState];
    
    // Get connection information
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    
    return NextResponse.json({
      success: true,
      connectionState: stateText,
      details: {
        readyState: connectionState,
        dbName,
        dbHost,
        models: Object.keys(mongoose.models)
      }
    });
  } catch (error) {
    console.error('Database connection check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 