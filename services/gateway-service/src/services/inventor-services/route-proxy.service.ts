import { AuthenticatedUser } from '@bus-booking/common/src/http/auth';
import { ListRoutesQuery } from '../../validation/routes.schema';
import { client, authHeader, handleAxiosError, buildInternalHeaders } from './client';

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

export const routeProxyService = {
  async getAllRoutes(params: ListRoutesQuery): Promise<RouteListResponse> {
    try {
      const response = await client.get<RouteListResponse>('/routes', {
        headers: authHeader.headers,
        params,
      });

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

  async getRouteById(id: string): Promise<RouteResponse> {
    try {
      const response = await client.get<RouteResponse>(`/routes/${id}`, {
        headers: authHeader.headers,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } 
  },

  async createRoute(user: AuthenticatedUser, payload: CreateRoutePayload): Promise<RouteResponse> {
    try {
      const response = await client.post<RouteResponse>('/routes', payload, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async updateRoute(user: AuthenticatedUser, id: string, payload: UpdateRoutePayload): Promise<RouteResponse> {
    try {
      const response = await client.patch<RouteResponse>(`/routes/${id}`, payload, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async deleteRoute(user: AuthenticatedUser, id: string): Promise<{ message: string }> {
    try {
      const response = await client.delete<{ message: string }>(`/routes/${id}`, {
        headers: buildInternalHeaders(user),
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
      }>('/routes/sources', {
        headers: authHeader.headers,
      });

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
      }>('/routes/destinations', {
        headers: authHeader.headers,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
