import { type WhereOptions } from 'sequelize';

import { TripModel } from '../model/trip.model.js';
import { UpdateTripInput, TripWithBookedSeats } from '../types/trip.types.js';
import { PaginatedResponse } from '@bus-booking/common/src/types/index.js';

const toDomainTrip = (model: TripModel): TripWithBookedSeats => ({
  id: model.id,
  busId: model.busId,
  routeId: model.routeId,
  travelDate: model.travelDate,
  departureTime: model.departureTime,
  arrivalTime: model.arrivalTime,
  availableSeats: model.availableSeats,
  bookedSeats: model.bookedSeats,
  fare: Number(model.fare),
  status: model.status,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class TripRepository {
  async findById(id: string): Promise<TripWithBookedSeats | null> {
    const trip = await TripModel.findByPk(id);

    return trip ? toDomainTrip(trip) : null;
  }

  async findAll(page: number, limit: number): Promise<PaginatedResponse<TripWithBookedSeats>> {
    const offset = (page - 1) * limit;

    const result = await TripModel.findAndCountAll({
      order: [
        ['travelDate', 'ASC'],
        ['departureTime', 'ASC'],
      ],
      limit,
      offset,
    });

    return {
      data: result.rows.map(toDomainTrip),
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  async create(data: TripWithBookedSeats): Promise<TripWithBookedSeats> {
    const trip = await TripModel.create(data);

    return toDomainTrip(trip);
  }

  async update(id: string, data: UpdateTripInput): Promise<TripWithBookedSeats | null> {
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

  async findByRouteAndDate(routeId: string, travelDate: string): Promise<TripWithBookedSeats[]> {
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

  async findByBus(
    busId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<TripWithBookedSeats>> {
    const offset = (page - 1) * limit;

    const result = await TripModel.findAndCountAll({
      where: { busId },
      order: [
        ['travelDate', 'ASC'],
        ['departureTime', 'ASC'],
      ],
      limit,
      offset,
    });

    return {
      data: result.rows.map(toDomainTrip),
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  async search(params: {
    routeId?: string;
    busId?: string;
    travelDate?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<TripWithBookedSeats>> {
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

    const result = await TripModel.findAndCountAll({
      where,
      order: [
        ['travelDate', 'ASC'],
        ['departureTime', 'ASC'],
      ],
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
    });

    return {
      data: result.rows.map(toDomainTrip),
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.count,
        totalPages: Math.ceil(result.count / params.limit),
      },
    };
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

  async updateSeatState(
    tripId: string,
    availableSeats: number,
    bookedSeats: string[],
  ): Promise<void> {
    await TripModel.update(
      {
        availableSeats,
        bookedSeats,
      },
      {
        where: {
          id: tripId,
        },
      },
    );
  }

  async cancelTrip(id: string): Promise<boolean> {
    return this.updateStatus(id, 'CANCELLED');
  }
}

export const tripRepository = new TripRepository();
