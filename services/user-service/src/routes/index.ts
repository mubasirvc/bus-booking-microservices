import type { Router } from 'express';
import { userRoutes } from './user.routes.js';

export const registerRoutes = (app: Router) => {
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'user-service' });
  });

  app.use('/users', userRoutes);
};
