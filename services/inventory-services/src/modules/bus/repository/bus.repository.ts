import { Op, type WhereOptions } from 'sequelize';

import { BusModel } from '../model/bus.model.js';

import { Bus, BusWithSeats, UpdateBusInput } from '../types/bus.types.js';
import { PaginatedResponse } from '@bus-booking/common';

const toDomainBus = (model: BusModel): BusWithSeats => ({
  id: model.id,
  operatorId: model.operatorId,
  name: model.name,
  busNumber: model.busNumber,
  type: model.type,
  totalSeats: model.totalSeats,
  seats: model.seats,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class BusRepository {
  async findById(id: string): Promise<Bus | null> {
    const bus = await BusModel.findByPk(id);

    return bus ? toDomainBus(bus) : null;
  }

  async findAll(params: { page: number; limit: number }): Promise<PaginatedResponse<Bus>> {
    const { page, limit } = params;

    const offset = (page - 1) * limit;

    const result = await BusModel.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    return {
      data: result.rows.map(toDomainBus),

      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  async create(data: BusWithSeats): Promise<BusWithSeats> {
    const bus = await BusModel.create(data);

    return toDomainBus(bus);
  }

  async update(id: string, operatorId: string, data: UpdateBusInput): Promise<Bus | null> {
    const bus = await BusModel.findOne({
      where: {
        id,
        operatorId,
      },
    });

    if (!bus) {
      return null;
    }

    await bus.update(data);

    return toDomainBus(bus);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await BusModel.destroy({
      where: { id },
    });

    return deleted > 0;
  }

  async findByBusNumber(busNumber: string): Promise<Bus | null> {
    const bus = await BusModel.findOne({
      where: { busNumber },
    });

    return bus ? toDomainBus(bus) : null;
  }

  async search(params: {
    name?: string;
    type?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<Bus>> {
    const where: WhereOptions = {};

    if (params.name) {
      Object.assign(where, {
        name: {
          [Op.iLike]: `%${params.name}%`,
        },
      });
    }

    if (params.type) {
      Object.assign(where, {
        type: params.type,
      });
    }

    const page = params.page;
    const limit = params.limit;

    const offset = (page - 1) * limit;

    const result = await BusModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    return {
      data: result.rows.map(toDomainBus),

      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  async findByOperator(operatorId: string, page = 1, limit = 10): Promise<PaginatedResponse<Bus>> {
    const offset = (page - 1) * limit;

    const result = await BusModel.findAndCountAll({
      where: {
        operatorId,
      },
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    return {
      data: result.rows.map(toDomainBus),

      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }
}

export const busRepository = new BusRepository();
