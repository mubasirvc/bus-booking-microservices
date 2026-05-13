import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './db/sequelize.js';
import { createServer } from 'node:http';


const main = async () => {
  try {
    await initializeDatabase();

    const app = createApp();
    const server = createServer(app);

    const port = env.INVENTORY_SERVICE_PORT;

    server.listen(port, () => {
      logger.info({ port }, 'Inventory service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down inventory service...');
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
    logger.error({ error }, 'Failed to start inventory service');
    process.exit(1);
  }
};

void main();
