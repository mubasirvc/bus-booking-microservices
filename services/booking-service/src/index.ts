import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './db/sequelize.js';
import { createServer } from 'node:http';
import './jobs/booking-expiry.listener.js';

import './config/redis.js';

import grpc from '@grpc/grpc-js';
import grpcServer from './grpc/server.js';
import { initPublisher } from './messaging/event-publishing.js';

const main = async () => {
  try {
    await initializeDatabase();
    await initPublisher();

    const app = createApp();
    const server = createServer(app);

    const port = env.BOOKING_SERVICE_PORT;

    const grpcPort = env.BOOKING_GRPC_PORT || 50052;

    server.listen(port, () => {
      logger.info({ port }, 'Booking service is running');
    });

     // gRPC server
    grpcServer.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), () => {
      grpcServer.start();

      logger.info({ port: grpcPort }, 'Booking gRPC service running');
    });

    const shutdown = () => {
      logger.info('Shutting down booking service...');
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
    logger.error({ error }, 'Failed to start booking service');
    process.exit(1);
  }
};

void main();
