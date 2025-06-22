import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not defined in environment variables");

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    await mongoose.connect(uri); 
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;