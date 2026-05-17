import axios from 'axios';
import { HttpError } from '@bus-booking/common';

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
  seatCount: number;
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
  userId: string;
  tripId: string;
  seatCount: number;
  totalAmount: number;
}

export interface UpdateBookingPayload {
  status?: string;
}

export interface SearchBookingsParams {
  userId?: string;
  tripId?: string;
  status?: string;
}

export const bookingProxyService = {
  async getBookingById(id: string): Promise<BookingResponse> {
    try {
      const response = await client.get<BookingResponse>(`/bookings/${id}`, authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getAllBookings(): Promise<BookingListResponse> {
    try {
      const response = await client.get<BookingListResponse>('/bookings', authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async createBooking(payload: CreateBookingPayload): Promise<BookingResponse> {
    try {
      const response = await client.post<BookingResponse>('/bookings', payload, authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async updateBooking(id: string, payload: UpdateBookingPayload): Promise<BookingResponse> {
    try {
      const response = await client.patch<BookingResponse>(`/bookings/${id}`, payload, authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async deleteBooking(id: string): Promise<{ message: string }> {
    try {
      const response = await client.delete<{
        message: string;
      }>(`/bookings/${id}`, authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async cancelBooking(id: string): Promise<BookingResponse> {
    try {
      const response = await client.patch<BookingResponse>(
        `/bookings/${id}/cancel`,
        {},
        authHeader,
      );

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async searchBookings(params: SearchBookingsParams): Promise<BookingListResponse> {
    try {
      const response = await client.get<BookingListResponse>('/bookings/search', {
        headers: authHeader.headers,
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getBookingsByUser(userId: string): Promise<BookingListResponse> {
    try {
      const response = await client.get<BookingListResponse>('/bookings/user', {
        headers: authHeader.headers,
        params: { userId },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
