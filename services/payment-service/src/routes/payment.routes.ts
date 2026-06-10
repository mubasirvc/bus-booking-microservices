import { asyncHandler, Role, validateRequest } from '@bus-booking/common';
import { createPayment, paymentWebhook } from '../controllers/payment.controller.js';
import { createPaymentSchema, paymentWebhookSchema } from '../validation/paymet.schema.js';

import { Router } from 'express';

export const paymentRoutes: Router = Router();

import { requireRole } from '../middleware/require-role.js';

paymentRoutes.post(
  '/create-order',
  requireRole(Role.USER),
  validateRequest({
    body: createPaymentSchema,
  }),
  asyncHandler(createPayment),
);

paymentRoutes.post(
  '/webhook',
  requireRole(Role.USER),
  validateRequest({
    body: paymentWebhookSchema,
  }),
  asyncHandler(paymentWebhook),
);
