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

    const httpPort = env.INVENTORY_SERVICE_PORT;

    const grpcPort = env.GRPC_PORT || 50051;

    server.listen(httpPort, () => {
      logger.info({ port: httpPort }, 'Inventory REST service running');
    });

    // gRPC server
    grpcServer.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), () => {
      grpcServer.start();

      logger.info({ port: grpcPort }, 'Inventory gRPC service running');
    });

    const shutdown = () => {
      logger.info('Shutting down inventory service...');

      grpcServer.forceShutdown();

      server.close(() => {
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);

    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error({ error }, 'Failed to start inventory service');

    process.exit(1);
  }
};

void main();
