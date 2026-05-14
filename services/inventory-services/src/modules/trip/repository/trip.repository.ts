import { type WhereOptions } from 'sequelize';

import { TripModel } from '../model/trip.model.js';
import { Trip, CreateTripInput, UpdateTripInput } from '../types/trip.types.js';

const toDomainTrip = (model: TripModel): Trip => ({
  id: model.id,
  busId: model.busId,
  routeId: model.routeId,
  travelDate: model.travelDate,
  departureTime: model.departureTime,
  arrivalTime: model.arrivalTime,
  fare: Number(model.fare),
  status: model.status,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class TripRepository {
  async findById(id: string): Promise<Trip | null> {
    const trip = await TripModel.findByPk(id);

    return trip ? toDomainTrip(trip) : null;
  }

  async findAll(): Promise<Trip[]> {
    const trips = await TripModel.findAll({
      order: [
        ['travelDate', 'ASC'],
        ['departureTime', 'ASC'],
      ],
    });

    return trips.map(toDomainTrip);
  }

  async create(data: CreateTripInput): Promise<Trip> {
    const trip = await TripModel.create(data);

    return toDomainTrip(trip);
  }

  async update(id: string, data: UpdateTripInput): Promise<Trip | null> {
    const trip = await TripModel.findByPk(id);

    if (!trip) {
      return null;
    }

    await trip.update(data);

    return toDomainTrip(trip);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await TripModel.destroy({
      where: { id },
    });

    return deleted > 0;
  }

  async findByRouteAndDate(routeId: string, travelDate: string): Promise<Trip[]> {
    const trips = await TripModel.findAll({
      where: {
        routeId,
        travelDate,
        status: 'ACTIVE',
      },
      order: [['departureTime', 'ASC']],
    });

    return trips.map(toDomainTrip);
  }

  async findByBus(busId: string): Promise<Trip[]> {
    const trips = await TripModel.findAll({
      where: { busId },
      order: [
        ['travelDate', 'ASC'],
        ['departureTime', 'ASC'],
      ],
    });

    return trips.map(toDomainTrip);
  }

  async search(params: {
    routeId?: string;
    busId?: string;
    travelDate?: string;
    status?: string;
  }): Promise<Trip[]> {
    const where: WhereOptions = {};

    if (params.routeId) {
      Object.assign(where, {
        routeId: params.routeId,
      });
    }

    if (params.busId) {
      Object.assign(where, {
        busId: params.busId,
      });
    }

    if (params.travelDate) {
      Object.assign(where, {
        travelDate: params.travelDate,
      });
    }

    if (params.status) {
      Object.assign(where, {
        status: params.status,
      });
    }

    const trips = await TripModel.findAll({
      where,
      order: [
        ['travelDate', 'ASC'],
        ['departureTime', 'ASC'],
      ],
    });

    return trips.map(toDomainTrip);
  }

  async updateStatus(id: string, status: string): Promise<boolean> {
    const updated = await TripModel.update(
      { status },
      {
        where: { id },
      },
    );

    return updated[0] > 0;
  }

  async cancelTrip(id: string): Promise<boolean> {
    return this.updateStatus(id, 'CANCELLED');
  }
}

export const tripRepository = new TripRepository();
