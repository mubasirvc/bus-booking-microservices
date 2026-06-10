import { AuthenticatedUser } from '@bus-booking/common/src/http/auth';
import { client, authHeader, handleAxiosError, buildInternalHeaders } from './client';

export interface BusDto {
  id: string;
  name: string;
  busNumber: string;
  type: string;
  totalSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusResponse {
  data: BusDto;
}

export interface BusListResponse {
  data: BusDto[];
}

export interface CreateBusPayload {
  name: string;
  busNumber: string;
  type: string;
  totalSeats: number;
}

export interface UpdateBusPayload {
  name?: string;
  busNumber?: string;
  type?: string;
  totalSeats?: number;
}

export interface SearchBusesParams {
  name?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface ListBusParams {
  page?: number;
  limit?: number;
}

export interface User{
  id: string;
  email?: string;
  role?: 'ADMIN' | 'CUSTOMER' | 'OPERATOR';
}

export const busProxyService = {
  async getAllBuses(user: AuthenticatedUser, params?: ListBusParams) {
    try {
      const response = await client.get('/buses', {
        headers: buildInternalHeaders(user),
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getMyBuses(user: AuthenticatedUser, params: ListBusParams) {
    try {
      const response = await client.get('/buses/my-buses', {
        headers: buildInternalHeaders(user),
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async createBus(user: AuthenticatedUser, payload: CreateBusPayload) {
    try {
      const response = await client.post('/buses', payload, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async updateBus(user: AuthenticatedUser, id: string, payload: UpdateBusPayload) {
    try {
      const response = await client.patch(`/buses/${id}`, payload, {
        headers: buildInternalHeaders(user),
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async searchBuses(user: AuthenticatedUser, params: SearchBusesParams) {
    try {
      const response = await client.get('/buses/search', {
        headers: buildInternalHeaders(user),
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async deleteBus(user: AuthenticatedUser, id: string) {
    try {
      const response = await client.delete(`/buses/${id}`, {
        headers: buildInternalHeaders(user),
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getBusById(user: AuthenticatedUser, id: string) {
    try {
      const response = await client.get(`/buses/${id}`, {
        headers: buildInternalHeaders(user),
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
