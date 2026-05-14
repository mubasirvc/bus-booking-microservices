import type { Router } from 'express';
import { routeRoutes } from './route.routes.js';

export const registerRoutes = (app: Router) => {

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'route-service' });
  });

  app.use('/routes', routeRoutes);
};
