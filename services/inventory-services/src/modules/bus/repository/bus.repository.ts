import { type WhereOptions } from 'sequelize';

import { BusModel } from '../model/bus.model.js';

import { Bus, CreateBusInput, UpdateBusInput } from '../types/bus.types.js';

const toDomainBus = (model: BusModel): Bus => ({
  id: model.id,
  name: model.name,
  busNumber: model.busNumber,
  type: model.type,
  totalSeats: model.totalSeats,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class BusRepository {
  async findById(id: string): Promise<Bus | null> {
    const bus = await BusModel.findByPk(id);

    return bus ? toDomainBus(bus) : null;
  }

  async findAll(): Promise<Bus[]> {
    const buses = await BusModel.findAll({
      order: [['name', 'ASC']],
    });

    return buses.map(toDomainBus);
  }

  async create(data: CreateBusInput): Promise<Bus> {
    const bus = await BusModel.create(data);

    return toDomainBus(bus);
  }

  async update(id: string, data: UpdateBusInput): Promise<Bus | null> {
    const bus = await BusModel.findByPk(id);

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

  async search(params: { name?: string; type?: string }): Promise<Bus[]> {
    const where: WhereOptions = {};

    if (params.name) {
      Object.assign(where, {
        name: params.name,
      });
    }

    if (params.type) {
      Object.assign(where, {
        type: params.type,
      });
    }

    const buses = await BusModel.findAll({
      where,
      order: [['name', 'ASC']],
    });

    return buses.map(toDomainBus);
  }
}

export const busRepository = new BusRepository();
