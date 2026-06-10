import axios from 'axios';
import { AuthenticatedUser, HttpError } from '@bus-booking/common';
import { env } from '../../config/env';

export const client = axios.create({
  baseURL: env.INVENTORY_SERVICE_URL,
  timeout: 5000,
});

export const authHeader = {
  headers: {
    'X-Internal-Token': env.INTERNAL_API_TOKEN,
  },
} as const;

export const buildInternalHeaders = (user: AuthenticatedUser) => ({
  'X-Internal-Token': env.INTERNAL_API_TOKEN,
  'X-User-Id': user.id,
  'X-User-Role': user.role,
});

const resolvedMessage = (status: number, data: unknown): string => {
  if (typeof data === 'object' && data && 'message' in data) {
    const message = (data as Record<string, unknown>).message;

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }

  return status >= 500
    ? 'Inventory service is unavailable'
    : 'An error occurred while processing the request';
};

export const handleAxiosError = (error: unknown): never => {
  if (!axios.isAxiosError(error) || !error.response) {
    throw new HttpError(500, 'Inventory service is unavailable');
  }

  throw new HttpError(
    error.response.status,
    resolvedMessage(error.response.status, error.response.data),
  );
};
