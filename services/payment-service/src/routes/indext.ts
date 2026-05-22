import type { Router } from 'express';
import { paymentRoutes } from './payment.routes.js';


export const registerRoutes = (app: Router) => {

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'payment-service' });
  });

  app.use('/', paymentRoutes);
};
