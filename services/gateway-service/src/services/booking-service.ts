import axios from 'axios';
import { AuthenticatedUser, HttpError, logger } from '@bus-booking/common';

import { env } from '../config/env.js';

const client = axios.create({
  baseURL: env.BOOKING_SERVICE_URL,
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
  'X-User-email': user.email,
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

export interface BookingDto {
  id: string;
  userId: string;
  tripId: string;
  seats: string[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponse {
  data: BookingDto;
}

export interface BookingListResponse {
  data: BookingDto[];
}

export interface CreateBookingPayload {
  tripId: string;
  seats: string[];
  totalAmount: number;
}

export interface UpdateBookingPayload {
  status?: string;
}

export interface SearchBookingsParams {
  userId?: string;
  tripId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const bookingProxyService = {
  async getBookingById(user: AuthenticatedUser, id: string): Promise<BookingResponse> {
    try {
      const response = await client.get<BookingResponse>(`/bookings/${id}`, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getAllBookings(
    user: AuthenticatedUser,
    page: number,
    limit: number,
  ): Promise<BookingListResponse> {
    try {
      const response = await client.get<BookingListResponse>('/bookings', {
        headers: buildInternalHeaders(user),
        params: { page, limit },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async createBooking(
    user: AuthenticatedUser,
    payload: CreateBookingPayload,
  ): Promise<BookingResponse> {
    try {
      const response = await client.post<BookingResponse>('/bookings', payload, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async updateBooking(
    user: AuthenticatedUser,
    id: string,
    payload: UpdateBookingPayload,
  ): Promise<BookingResponse> {
    try {
      const response = await client.patch<BookingResponse>(`/bookings/${id}`, payload, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async deleteBooking(user: AuthenticatedUser, id: string): Promise<{ message: string }> {
    try {
      const response = await client.delete<{
        message: string;
      }>(`/bookings/${id}`, { headers: buildInternalHeaders(user) });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async cancelBooking(user: AuthenticatedUser, id: string): Promise<BookingResponse> {
    try {
      const response = await client.patch<BookingResponse>(`/bookings/${id}/cancel`, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async searchBookings(
    user: AuthenticatedUser,
    params: SearchBookingsParams,
  ): Promise<BookingListResponse> {
    try {
      const response = await client.get<BookingListResponse>('/bookings/search', {
        headers: buildInternalHeaders(user),
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getBookingsByUser(
    user: AuthenticatedUser,
    page: number,
    limit: number,
  ): Promise<BookingListResponse> {
    try {
      const response = await client.get<BookingListResponse>('/bookings/user', {
        headers: buildInternalHeaders(user),
        params: { page, limit },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
