import { Router } from 'express';

import { createPayment, paymentWebhook } from '../controllers/payment.controller';
import { asyncHandler, validateRequest } from '@bus-booking/common';
import { createPaymentSchema, paymentWebhookSchema } from '../validation/payment.schema';
import { requireAuth } from '../middleware/require-auth';

const paymentRoutes: Router = Router();

paymentRoutes.post( '/create-order', requireAuth, validateRequest({ body: createPaymentSchema, }),asyncHandler(createPayment));

paymentRoutes.post('/webhook',requireAuth, validateRequest({ body: paymentWebhookSchema }),  asyncHandler(paymentWebhook));

export { paymentRoutes };
