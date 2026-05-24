import { Sequelize } from 'sequelize';

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const sequelize = new Sequelize(env.PAYMENT_DB_URL, {
  dialect: 'postgres',
  logging:
    env.NODE_ENV === 'development'
      ? (msg: unknown) => {
          logger.debug({ sequelize: msg });
        }
      : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

export const connectToDatabase = async () => {
  await sequelize.authenticate();
  logger.info('Payment database connection established successfully.');
};

export const initializeDatabase = async () => {
  await connectToDatabase();

  const syncOptions = env.NODE_ENV === 'development' ? {} : { alter: true };
  await sequelize.sync(syncOptions);
  logger.info('Payment database synchronized.');
};

export const closeDatabase = async () => {
  await sequelize.close();
  logger.info('Payment database connection closed.');
};
