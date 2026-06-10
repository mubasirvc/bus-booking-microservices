import axios from 'axios';
import { AuthenticatedUser, HttpError } from '@bus-booking/common';

import { env } from '../config/env.js';

const client = axios.create({
  baseURL: env.PAYMENT_SERVICE_URL,
  timeout: 5000,
});

const authHeader = {
  headers: {
    'X-Internal-Token': env.INTERNAL_API_TOKEN,
  },
} as const;

export const buildInternalHeaders = (user: AuthenticatedUser) => ({
  'X-Internal-Token': env.INTERNAL_API_TOKEN,
  'X-User-Id': user.id,
  'X-User-Role': user.role,
});

const resolveMessage = (status: number, data: unknown): string => {
  if (typeof data === 'object' && data && 'message' in data) {
    const message = (data as Record<string, unknown>).message;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return status >= 500 ? 'Booking service unavailable' : 'Request failed';
};

const handleAxiosError = (error: unknown): never => {
  if (!axios.isAxiosError(error) || !error.response) {
    throw new HttpError(500, 'Booking service unavailable');
  }

  throw new HttpError(
    error.response.status,
    resolveMessage(error.response.status, error.response.data),
  );
};

// body { bookingId, userId, amount }
// paymentRoutes.post(
//   '/create-order',
//   validateRequest({ body: createPaymentSchema }),
//   asyncHandler(createPayment),
// );

// paymentRoutes.post('/webhook', asyncHandler(paymentWebhook));

// {
//   "event": "payment.captured",
//   "payload": {
//     "payment": {
//       "entity": {
//         "id": "d3e71e93-cf53-4924-b251-f723a1128d78",
//         "order_id": "order_Sylbqs3wuRIVuL"
//       }
//     }
//   }
// }


export interface CreatePaymentPayload {
  bookingId: string;
  userId: string;
  amount: number;
}

export const paymentProxyService = {
  async createOrder(user: AuthenticatedUser, payload: CreatePaymentPayload) {
    try {
      const response = await client.post('/payments/create-order', payload, {
        headers: {
          ...buildInternalHeaders(user),
        },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async webhook(user: AuthenticatedUser, payload: unknown) {
    try {
      const response = await client.post('/payments/webhook', payload, {
        headers: {
          ...buildInternalHeaders(user),
        },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
