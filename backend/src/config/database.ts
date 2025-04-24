import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import config from './constant';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 45_000,
    });

    logger.info(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
