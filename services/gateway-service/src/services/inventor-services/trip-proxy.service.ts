import { ListTripsQuery } from '../../validation/trip.schema';
import { client, authHeader, handleAxiosError } from './client';

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



export const tripProxyService = {
  async getTripById(id: string): Promise<TripResponse> {
    try {
      const response = await client.get<TripResponse>(`/trips/${id}`, authHeader);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getAllTrips(query?: ListTripsQuery): Promise<TripListResponse> {
    try {
      const response = await client.get<TripListResponse>('/trips', {
        headers: authHeader.headers,
        params: query,
      });
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
