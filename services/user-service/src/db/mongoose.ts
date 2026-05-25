import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const connectToDatabase = async () => {
  await mongoose.connect(env.USER_DB_URL);

  logger.info('MongoDB connection established successfully.');
};

export const initializeDatabase = async () => {
  await connectToDatabase();

  logger.info('MongoDB initialized');
};

export const closeDatabase = async () => {
  await mongoose.connection.close();

  logger.info('MongoDB connection closed.');
};
