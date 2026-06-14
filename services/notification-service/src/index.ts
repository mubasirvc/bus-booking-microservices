import { createApp } from './app.js';
import { env } from './config/env.js';
import { startAuthEventConsumer } from './messaging/auth-consumer.js';
import { startBookingEventConsumer } from './messaging/booking-consumer.js';
import { logger } from './utils/logger.js';
import { createServer } from 'node:http';

const main = async () => {
  try {
    await startAuthEventConsumer()
    await startBookingEventConsumer();
    
    const app = createApp();
    const server = createServer(app);

    const port = env.NOTiFiCATION_SERVICE_PORT;

    server.listen(port, () => {
      logger.info({ port }, 'Notification service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down notification service...');
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
    logger.error({ error }, 'Failed to start notification service');
    process.exit(1);
  }
};

void main();
