import { Router } from 'express';

import { createPayment, paymentWebhook } from '../controllers/payment.controller';
import { asyncHandler, validateRequest } from '@bus-booking/common';
import { createPaymentSchema, paymentWebhookSchema } from '../validation/payment.schema';
import { requireAuth } from '../middleware/require-auth';
import { paymentRateLimiter } from '../middleware/rate-limit.middleware';

const paymentRoutes: Router = Router();

paymentRoutes.post( '/create-order', paymentRateLimiter, requireAuth, validateRequest({ body: createPaymentSchema, }),asyncHandler(createPayment));

paymentRoutes.post('/webhook',requireAuth, validateRequest({ body: paymentWebhookSchema }),  asyncHandler(paymentWebhook));

export { paymentRoutes };
