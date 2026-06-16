import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/error-handler';
import { setupSwagger } from './docs/swagger';
import { registerRoutes } from './routes';
import { apiRateLimiter } from './middleware/rate-limit.middleware';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(apiRateLimiter());
  registerRoutes(app);
  
  setupSwagger(app);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.use(errorHandler);

  return app;
};
