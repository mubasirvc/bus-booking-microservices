import { Router } from 'express';
import { validateRequest } from '@bus-booking/common';
import {
  loginHandler,
  refreshHandler,
  registerHandler,
  revokeHandler,
} from '../controllers/auth.controller.js';
import { loginSchema, refreshSchema, registerSchema, revokeSchema } from './auth.schema.js';

export const authRouter: Router = Router();

authRouter.post('/register', validateRequest({ body: registerSchema.shape.body }), registerHandler);
authRouter.post('/login', validateRequest({ body: loginSchema.shape.body }), loginHandler);
authRouter.post('/refresh', validateRequest({ body: refreshSchema.shape.body }), refreshHandler);
authRouter.post('/revoke', validateRequest({ body: revokeSchema.shape.body }), revokeHandler);
