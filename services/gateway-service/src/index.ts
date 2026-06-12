import './docs/openapi.js';

import { redisClient } from '@bus-booking/common';
import { createServer } from 'http';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';
import { env } from './config/env.js';

const main = async () => {
  try {

    const app = createApp();
    const server = createServer(app);

    const port = env.GATEWAY_PORT;

    server.listen(port, () => {
      logger.info({ port }, 'Gateway service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down gateway service...');

      Promise.all([])
        .catch((error: unknown) => {
          logger.error({ error }, 'Error during shutdown tasks');
        })
        .finally(() => {
          server.close(() => process.exit(0));
        });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error({ error }, 'Failed to start gateway service');
    process.exit(1);
  }
};

void main();
