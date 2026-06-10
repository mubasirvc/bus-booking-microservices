import { AuthenticatedUser, HttpError } from '@bus-booking/common';
import axios from 'axios';

import { env } from '../config/env';
import { ListUsersQuery } from '../validation/user.schema';

const client = axios.create({
  baseURL: env.USER_SERVICE_URL,
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

export interface UserDto {
  id: string;
  email: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  data: UserDto;
}

export interface UserLisResponse {
  data: UserDto[];
}

export interface CreateUserPayload {
  email: string;
  userName: string;
}

export interface SearchUsersParams {
  query: string;
  limit?: number;
  exclude?: string[];
}

export interface GetMyBookingsParams {
  status?: string;
  page?: number;
  limit?: number;
}

const resolvedMessage = (status: number, data: unknown): string => {
  if (typeof data === 'object' && data && 'message' in data) {
    const message = (data as Record<string, unknown>).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }

  return status >= 500
    ? 'UserService service is unavailable'
    : 'An error occurred while processing the request';
};

const handleAxiosError = (error: unknown): never => {
  if (!axios.isAxiosError(error) || !error.response) {
    throw new HttpError(500, 'UserService service is unavailable');
  }

  const { status, data } = error.response as { status: number; data: unknown };

  throw new HttpError(status, resolvedMessage(status, data));
};

export const userProxyService = {
  async getUserById(id: string, user: AuthenticatedUser): Promise<UserResponse> {
    try {
      const response = await client.get<UserResponse>(`/users/${id}`, {
        headers: buildInternalHeaders(user),
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getAllUsers(user: AuthenticatedUser): Promise<UserLisResponse> {
    try {
      const response = await client.get<UserLisResponse>(`/users`, {
        headers: buildInternalHeaders(user),
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async createUser(payload: CreateUserPayload, user: AuthenticatedUser): Promise<UserResponse> {
    try {
      const response = await client.post<UserResponse>(`/users`, payload, {
        headers: buildInternalHeaders(user),
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async searchUsers(params: SearchUsersParams, user: AuthenticatedUser): Promise<UserLisResponse> {
    try {
      const response = await client.get<UserLisResponse>(`/users/search`, {
        headers: buildInternalHeaders(user),
        params: {
          query: params.query,
          ...(params.limit ? { limit: params.limit } : {}),
          ...(params.exclude && params.exclude.length > 0 ? { exclude: params.exclude } : {}),
        },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getMyBookings(params: GetMyBookingsParams, user: AuthenticatedUser) {
    try {
      const response = await client.get('/users/my-bookings', {
        headers: buildInternalHeaders(user),
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getBookingDetails(bookingId: string, user: AuthenticatedUser) {
    try {
      const response = await client.get(`users/my-bookings/${bookingId}`, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
