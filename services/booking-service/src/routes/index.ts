import type { Router } from 'express';
import { bookingRoutes } from './booking.routes.js';

export const registerRoutes = (app: Router) => {
  app.get('/hea', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'booking-service' });
  });

  app.use('/bookings', bookingRoutes);
};
