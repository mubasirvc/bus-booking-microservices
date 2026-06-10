import { Router } from 'express';

import { createPayment, paymentWebhook } from '../controllers/payment.controller';
import { asyncHandler, validateRequest } from '@bus-booking/common';
import { createPaymentSchema, paymentWebhookSchema } from '../validation/payment.schema';

const paymentRoutes: Router = Router();

paymentRoutes.post( '/create-order', validateRequest({ body: createPaymentSchema, }),asyncHandler(createPayment));

paymentRoutes.post('/webhook',validateRequest({ body: paymentWebhookSchema }),  asyncHandler(paymentWebhook));

export { paymentRoutes };
