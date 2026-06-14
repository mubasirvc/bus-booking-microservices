import type { Router } from 'express';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { routeRouter } from './inventory-routes/route.routes';
import { tripRouter } from './inventory-routes/trip.routes';
import { busRouter } from './inventory-routes/bus.routes';
import { bookingRouter } from './booking.routes';
import { paymentRoutes } from './payment.routes';

export const registerRoutes = (app: Router) => {

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'gateway-service' });
  });

  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/routes', routeRouter);
  app.use('/trips', tripRouter);
  app.use('/buses', busRouter);
  app.use('/bookings', bookingRouter);
  app.use('/payments',paymentRoutes);
};
