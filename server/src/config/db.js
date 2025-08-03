import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

const mongodb = mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

export default mongodb;