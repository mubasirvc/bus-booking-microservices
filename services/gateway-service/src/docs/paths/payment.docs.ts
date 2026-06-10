import { z } from 'zod';

import { registry } from '../registry';

import { createPaymentSchema } from '../../validation/payment.schema.js';

// ======================================================
// Shared Schemas
// ======================================================

const paymentSchema = z.object({
  id: z.string().uuid().openapi({
    example: 'd3e71e93-cf53-4924-b251-f723a1128d78',
  }),

  bookingId: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),

  userId: z.string().uuid().openapi({
    example: '550e8400-e29b-41d4-a716-446655440001',
  }),

  orderId: z.string().openapi({
    example: 'order_Sylbqs3wuRIVuL',
  }),

  amount: z.number().openapi({
    example: 1200,
  }),

  status: z.enum([
    'PENDING',
    'SUCCESS',
    'FAILED',
  ]),

  createdAt: z.string().datetime().openapi({
    example: '2026-06-09T10:00:00Z',
  }),

  updatedAt: z.string().datetime().openapi({
    example: '2026-06-09T10:00:00Z',
  }),
});

const webhookSchema = z.object({
  event: z.string().openapi({
    example: 'payment.captured',
  }),

  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string().openapi({
          example:
            'd3e71e93-cf53-4924-b251-f723a1128d78',
        }),

        order_id: z.string().openapi({
          example: 'order_Sylbqs3wuRIVuL',
        }),
      }),
    }),
  }),
});

// ======================================================
// POST /payments/create-order
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/payments/create-order',

  tags: ['Payments'],

  summary: 'Create payment order',

  security: [
    {
      bearerAuth: [],
    },
  ],

  request: {
    body: {
      required: true,

      content: {
        'application/json': {
          schema: createPaymentSchema,

          example: {
            bookingId:
              '550e8400-e29b-41d4-a716-446655440000',
            amount: 1200,
          },
        },
      },
    },
  },

  responses: {
    201: {
      description: 'Payment order created successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            data: paymentSchema,
          }),
        },
      },
    },

    400: {
      description: 'Validation error',
    },

    404: {
      description: 'Booking not found',
    },
  },
});

// ======================================================
// POST /payments/webhook
// ======================================================

registry.registerPath({
  method: 'post',

  path: '/payments/webhook',

  tags: ['Payments'],

  summary: 'Payment provider webhook',

  request: {
    body: {
      required: true,

      content: {
        'application/json': {
          schema: webhookSchema,

          example: {
            event: 'payment.captured',

            payload: {
              payment: {
                entity: {
                  id: 'd3e71e93-cf53-4924-b251-f723a1128d78',
                  order_id: 'order_Sylbqs3wuRIVuL',
                },
              },
            },
          },
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Webhook processed successfully',

      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),

            message: z.string(),
          }),

          example: {
            success: true,
            message: 'Webhook processed successfully',
          },
        },
      },
    },

    400: {
      description: 'Invalid webhook payload',
    },
  },
});