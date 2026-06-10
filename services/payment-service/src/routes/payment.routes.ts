import { asyncHandler, validateRequest } from '@bus-booking/common';
import { createPayment, paymentWebhook } from '../controllers/payment.controller.js';
import { createPaymentSchema, paymentWebhookSchema } from '../validation/paymet.schema.js';

import { Router } from 'express';

export const paymentRoutes: Router = Router();

paymentRoutes.post(
  '/create-order',
  validateRequest({ body: createPaymentSchema }),
  asyncHandler(createPayment),
);
paymentRoutes.post('/webhook', validateRequest({ body: paymentWebhookSchema }), asyncHandler(paymentWebhook));
