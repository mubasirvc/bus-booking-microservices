
import { Router } from 'express';

import { asyncHandler, validateRequest } from '@bus-booking/common';

import { loginUser, refreshTokens, registerUser, revokeTokens, verifyEmail } from '../controllers/auth.controller';
import { loginSchema, refreshSchema, registerSchema, revokeSchema, verifyEmailSchema } from '../validation/auth.schema';

export const authRouter: Router = Router();

authRouter.post('/register', validateRequest({ body: registerSchema }), asyncHandler(registerUser));
authRouter.post('/login', validateRequest({ body: loginSchema }), asyncHandler(loginUser));
authRouter.post('/refresh', validateRequest({ body: refreshSchema }), asyncHandler(refreshTokens));
authRouter.post('/revoke', validateRequest({ body: revokeSchema }), asyncHandler(revokeTokens));
authRouter.get('/verify-email', validateRequest({query: verifyEmailSchema}), asyncHandler(verifyEmail))