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

  async reserveSeats(tripId: string, seats: string[]) {
    const trip = await this.repository.findById(tripId);

    if (!trip) {
      throw new HttpError(404, 'Trip not found');
    }

    const alreadyBooked = trip.bookedSeats?.filter((seat) => seats.includes(seat)) ?? [];

    if (alreadyBooked.length > 0) {
      throw new HttpError(400, `Seats already booked: ${alreadyBooked.join(', ')}`);
    }

    const bus = await this.busRepository.findById(trip.busId);

    if (!bus) {
      throw new HttpError(404, 'Bus not found');
    }

    const route = await this.routeRepository.findById(trip.routeId);

    if (!route) {
      throw new HttpError(404, 'Route not found');
    }

    const updatedBookedSeats = [...(trip.bookedSeats ?? []), ...seats];

    const remainingSeats = trip.availableSeats - seats.length;

    await this.repository.updateSeatState(tripId, remainingSeats, updatedBookedSeats);

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

  async releaseSeats(tripId: string, seats: string[]) {
    const trip = await this.repository.findById(tripId);

    if (!trip) {
      throw new HttpError(404, 'Trip not found');
    }

    const updatedBookedSeats = (trip.bookedSeats ?? []).filter((seat) => !seats.includes(seat));

    const availableSeats = trip.availableSeats + seats.length;

    await this.repository.updateSeatState(tripId, availableSeats, updatedBookedSeats);

    return {
      success: true,
    };
  }
}

export const tripGrpcService = new TripGrpcService(tripRepository, busRepository, routeRepository);
