import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './db/sequelize.js';
import { createServer } from 'node:http';
import grpc from '@grpc/grpc-js';
import grpcServer from './grpc/server.js';

const main = async () => {
  try {
    await initializeDatabase();

    const app = createApp();
    const server = createServer(app);

    const port = env.PAYMENT_SERVICE_PORT;

    const grpcPort = env.PAYMENT_GRPC_PORT || 50053;

    server.listen(port, () => {
      logger.info({ port }, 'Payment service is running');
    });

    grpcServer.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), () => {
      grpcServer.start();

      logger.info({ port: grpcPort }, 'Payment gRPC service running');
    });

    const shutdown = () => {
      logger.info('Shutting down payment service...');
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
    logger.error({ error }, 'Failed to start payment service');
    process.exit(1);
  }
};

void main();
