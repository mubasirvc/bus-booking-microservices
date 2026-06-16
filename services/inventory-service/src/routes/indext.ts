import type { Router } from 'express';
import { routeRoutes } from './route.routes.js';
import { tripRoutes } from './trip.routes.js';
import { busRoutes } from './bus.routes.js';

export const registerRoutes = (app: Router) => {

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'route-service' });
  });

  app.use('/routes', routeRoutes);
  app.use('/trips', tripRoutes);
  app.use('/buses', busRoutes);
};
