import { HttpError } from '@bus-booking/common';

import { TripRepository, tripRepository } from '../repository/trip.repository.js';
import { busRepository, BusRepository } from '../../bus/repository/bus.repository.js';
import { routeRepository, RouteRepository } from '../../route/repository/route.repository.js';

class TripGrpcService {
  constructor(
    private readonly repository: TripRepository,
    private readonly busRepository: BusRepository,
    private readonly routeRepository: RouteRepository,
  ) {}

  async checkSeatAvailability(tripId: string): Promise<number> {
    const trip = await this.repository.findById(tripId);

    if (!trip) {
      throw new HttpError(404, 'Trip not found');
    }

    return trip.availableSeats ?? 0;
  }

  async reserveSeats(tripId: string, seatCount: number) {
    const trip = await this.repository.findById(tripId);

    if (!trip) {
      throw new HttpError(404, 'Trip not found');
    }

    if (trip.availableSeats === undefined || trip.availableSeats < seatCount) {
      throw new HttpError(400, 'Not enough seats');
    }

    const bus = await this.busRepository.findById(trip.busId);

    if (!bus) {
      throw new HttpError(404, 'Bus not found');
    }

    const route = await this.routeRepository.findById(trip.routeId);

    if (!route) {
      throw new HttpError(404, 'Route not found');
    }

    const remainingSeats = trip.availableSeats - seatCount;

    await this.repository.updateAvailableSeats(tripId, remainingSeats);

    return {
      success: true,
      remainingSeats,
      fare: trip.fare,
      busName: bus.name,
      busId: bus.id,
      source: route.source,
      destination: route.destination,
      travelDate: trip.travelDate,
    };
  }

  async releaseSeats(tripId: string, seatCount: number) {
    const trip = await this.repository.findById(tripId);

    if (!trip) {
      throw new HttpError(404, 'Trip not found');
    }

    await this.repository.updateAvailableSeats(tripId, (trip.availableSeats ?? 0) + seatCount);

    return {
      success: true,
    };
  }
}

export const tripGrpcService = new TripGrpcService(tripRepository, busRepository, routeRepository);
