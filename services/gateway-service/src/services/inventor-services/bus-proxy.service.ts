import { client, authHeader, handleAxiosError } from './client';

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
  async getAllBuses(params?: ListBusParams) {
    try {
      const response = await client.get('/buses', {
        headers: authHeader.headers,
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getMyBuses(params: ListBusParams) {
    try {
      const response = await client.get('/buses/my-buses', {
        headers: {
          ...authHeader.headers,
          // 'X-User-Id': user.id,
          // 'X-User-Role': user.role,
        },
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async createBus(payload: CreateBusPayload) {
    try {
      const response = await client.post('/buses', payload, {
        headers: {
          ...authHeader.headers,
          // 'X-User-Id': user.id,
          // 'X-User-Role': user.role,
        },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async updateBus(id: string, payload: UpdateBusPayload) {
    try {
      const response = await client.patch(`/buses/${id}`, payload, {
        headers: {
          ...authHeader.headers,
          // 'X-User-Id': user.id,
          // 'X-User-Role': user.role,
        },
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async searchBuses(params: SearchBusesParams) {
    try {
      const response = await client.get('/buses/search', {
        headers: authHeader.headers,
        params,
      });

      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async deleteBus(id: string) {
    try {
      const response = await client.delete(`/buses/${id}`, {
        headers: {
          ...authHeader.headers,
          // 'X-User-Id': user.id,
          // 'X-User-Role': user.role,
        },
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getBusById(id: string) {
    try {
      const response = await client.get(`/buses/${id}`, authHeader);
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
