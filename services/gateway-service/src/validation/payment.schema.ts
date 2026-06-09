import { z } from '@bus-booking/common';

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  userId: z.string(),
  amount: z.number().positive(),
});


export const paymentWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string().uuid(),
        order_id: z.string().uuid(),
      }),
    }),
  }),
});