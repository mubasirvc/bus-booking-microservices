import { HttpError } from '@bus-booking/common';
import axios from 'axios';

import { env } from '../config/env';

const client = axios.create({
  baseURL: env.INVENTORY_SERVICE_URL,
  timeout: 5000,
});

const authHeader = {
  headers: {
    'X-Internal-Token': env.INTERNAL_API_TOKEN,
  },
} as const;


export interface RouteDto {
  id: string;
  source: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteResponse {
  data: RouteDto;
}

export interface RouteListResponse {
  data: RouteDto[];
}

export interface CreateRoutePayload {
  source: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
}

export interface UpdateRoutePayload {
  source?: string;
  destination?: string;
  distanceKm?: number;
  durationMinutes?: number;
}

export interface TripDto {
  id: string;
  busId: string;
  routeId: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripResponse {
  data: TripDto;
}

export interface TripListResponse {
  data: TripDto[];
}

export interface CreateTripPayload {
  busId: string;
  routeId: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
}

export interface UpdateTripPayload {
  busId?: string;
  routeId?: string;
  travelDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  fare?: number;
  status?: string;
}

export interface SearchTripsParams {
  routeId?: string;
  busId?: string;
  travelDate?: string;
  status?: string;
}

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

const handleAxiosError = (error: unknown): never => {
  if (!axios.isAxiosError(error) || !error.response) {
    throw new HttpError(500, 'Inventory service is unavailable');
  }

  const { status, data } = error.response as {
    status: number;
    data: unknown;
  };

  throw new HttpError(status, resolvedMessage(status, data));
};

export const inventoryProxyService = {
  async getAllRoutes(): Promise<RouteListResponse> {
    try {
      const response = await client.get<RouteListResponse>('/routes', authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getRouteById(id: string): Promise<RouteResponse> {
    try {
      const response = await client.get<RouteResponse>(`/routes/${id}`, authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async createRoute(payload: CreateRoutePayload): Promise<RouteResponse> {
    try {
      const response = await client.post<RouteResponse>('/routes', payload, authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async updateRoute(id: string, payload: UpdateRoutePayload): Promise<RouteResponse> {
    try {
      const response = await client.patch<RouteResponse>(`/routes/${id}`, payload, authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async deleteRoute(id: string): Promise<{ message: string }> {
    try {
      const response = await client.delete<{ message: string }>(`/routes/${id}`, authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async searchRoutes(query: string): Promise<RouteListResponse> {
    try {
      const response = await client.get<RouteListResponse>('/routes/search', {
        headers: authHeader.headers,
        params: { query },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getSources(): Promise<{
    data: string[];
  }> {
    try {
      const response = await client.get<{
        data: string[];
      }>('/routes/sources', authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getDestinations(): Promise<{
    data: string[];
  }> {
    try {
      const response = await client.get<{
        data: string[];
      }>('/routes/destinations', authHeader);

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getTripById(id: string): Promise<TripResponse> {
    try {
      const response = await client.get<TripResponse>(`/trips/${id}`, authHeader);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getAllTrips(): Promise<TripListResponse> {
    try {
      const response = await client.get<TripListResponse>('/trips', authHeader);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async createTrip(payload: CreateTripPayload): Promise<TripResponse> {
    try {
      const response = await client.post<TripResponse>('/trips', payload, authHeader);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async updateTrip(id: string, payload: UpdateTripPayload): Promise<TripResponse> {
    try {
      const response = await client.patch<TripResponse>(`/trips/${id}`, payload, authHeader);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async deleteTrip(id: string): Promise<{ message: string }> {
    try {
      const response = await client.delete<{ message: string }>(`/trips/${id}`, authHeader);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async cancelTrip(id: string): Promise<{ message: string }> {
    try {
      const response = await client.patch<{ message: string }>(
        `/trips/${id}/cancel`,
        {},
        authHeader,
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async searchTrips(params: SearchTripsParams): Promise<TripListResponse> {
    try {
      const response = await client.get<TripListResponse>('/trips/search', {
        headers: authHeader.headers,
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};

