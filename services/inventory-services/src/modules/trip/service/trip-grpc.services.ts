import { HttpError } from '@bus-booking/common';

import { TripRepository, tripRepository } from '../repository/trip.repository.js';

class TripGrpcService {
  constructor(private readonly repository: TripRepository) {}

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

    const remainingSeats = trip.availableSeats - seatCount;

    await this.repository.updateAvailableSeats(tripId, remainingSeats);

    return {
      success: true,
      remainingSeats,
      fare: trip.fare,
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

export const tripGrpcService = new TripGrpcService(tripRepository);
