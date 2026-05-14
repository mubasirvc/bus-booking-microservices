import type { Router } from 'express';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { routeRouter } from './inventory-routes/router.routes';

export const registerRoutes = (app: Router) => {
  // Health check endpoint for Docker/K8s
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'gateway-service' });
  });

  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/routes', routeRouter);  
};
