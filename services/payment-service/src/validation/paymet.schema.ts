import { z } from '@bus-booking/common';

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().optional().default('INR'),
});

export const paymentWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string().uuid(),
        order_id: z.string(),
      }),
    }),
  }),
});

export const updatePaymentSchema = z
  .object({
    status: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),

    razorpayPaymentId: z.string().optional(),

    razorpayOrderId: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const paymentIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const searchPaymentsQuerySchema = z.object({
  bookingId: z.string().uuid().optional(),

  userId: z.string().uuid().optional(),

  status: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),
});

export type CreatePaymentBody = z.infer<typeof createPaymentSchema>;

export type UpdatePaymentBody = z.infer<typeof updatePaymentSchema>;

export type PaymentIdParams = z.infer<typeof paymentIdParamsSchema>;

export type SearchPaymentsQuery = z.infer<typeof searchPaymentsQuerySchema>;
