import { HttpError, PaginatedResponse } from '@bus-booking/common';
import { UniqueConstraintError } from 'sequelize';

import { Bus, CreateBusInput, UpdateBusInput } from '../types/bus.types.js';

import { BusRepository, busRepository } from '../repository/bus.repository.js';

class BusService {
  constructor(private readonly repository: BusRepository) {}

  async getBusById(id: string): Promise<Bus> {
    const bus = await this.repository.findById(id);

    if (!bus) {
      throw new HttpError(404, 'Bus not found');
    }

    return bus;
  }

  async getAllBuses(params: { page: number; limit: number }): Promise<PaginatedResponse<Bus>> {
    return this.repository.findAll(params);
  }

  async createBus(input: CreateBusInput): Promise<Bus> {
    if (input.totalSeats <= 0) {
      throw new HttpError(400, 'Total seats must be greater than zero');
    }

    try {
      const seats = Array.from({ length: input.totalSeats }, (_, index) => ({
        seatNumber: 'S' + String(index + 1),
      }));

      return await this.repository.create({ ...input, seats });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new HttpError(409, 'Bus number already exists');
      }

      throw error;
    }
  }

  async getBusesByOperator(
    operatorId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Bus>> {
    return this.repository.findByOperator(operatorId, page, limit);
  }

  async updateBus(id: string, operatorId: string, input: UpdateBusInput): Promise<Bus> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new HttpError(404, 'Bus not found');
    }

    if (input.totalSeats !== undefined && input.totalSeats <= 0) {
      throw new HttpError(400, 'Total seats must be greater than zero');
    }

    try {
      const updated = await this.repository.update(id, operatorId, input);

      if (!updated) {
        throw new HttpError(404, 'Bus not found');
      }

      return updated;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new HttpError(409, 'Bus number already exists');
      }

      throw error;
    }
  }

  async deleteBus(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new HttpError(404, 'Bus not found');
    }
  }

  async searchBuses(params: {
    name?: string;
    type?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<Bus>> {
    return this.repository.search(params);
  }
}

export const busService = new BusService(busRepository);
