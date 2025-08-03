import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import postRoutes from './src/routes/posts.js';
import userRoutes from './src/routes/users.js';
import commentRoutes from './src/routes/comments.js';
import mongodb from './src/config/db.js';

dotenv.config({path: '.env'});

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://ciaan-task.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Database connection
mongodb;

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});