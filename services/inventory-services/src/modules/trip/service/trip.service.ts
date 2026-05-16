import { HttpError } from '@bus-booking/common';

import { Trip, CreateTripInput, UpdateTripInput } from '../types/trip.types.js';

import { TripRepository, tripRepository } from '../repository/trip.repository.js';

class TripService {
  constructor(private readonly repository: TripRepository) {}

  async getTripById(id: string): Promise<Trip> {
    const trip = await this.repository.findById(id);

    if (!trip) {
      throw new HttpError(404, 'Trip not found');
    }

    return trip;
  }

  async getAllTrips(): Promise<Trip[]> {
    return this.repository.findAll();
  }

  async createTrip(input: CreateTripInput): Promise<Trip> {
    if (new Date(input.arrivalTime) <= new Date(input.departureTime)) {
      throw new HttpError(400, 'Arrival time must be after departure time');
    }

    if (input.fare <= 0) {
      throw new HttpError(400, 'Fare must be greater than zero');
    }

    return this.repository.create(input);
  }

  async updateTrip(id: string, input: UpdateTripInput): Promise<Trip> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new HttpError(404, 'Trip not found');
    }

    const departure = input.departureTime ?? existing.departureTime;

    const arrival = input.arrivalTime ?? existing.arrivalTime;

    if (new Date(arrival) <= new Date(departure)) {
      throw new HttpError(400, 'Arrival time must be after departure time');
    }

    if (input.fare !== undefined && input.fare <= 0) {
      throw new HttpError(400, 'Fare must be greater than zero');
    }

    const updated = await this.repository.update(id, input);

    if (!updated) {
      throw new HttpError(404, 'Trip not found');
    }

    return updated;
  }

  async deleteTrip(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new HttpError(404, 'Trip not found');
    }
  }

  async searchTrips(params: {
    routeId?: string;
    busId?: string;
    travelDate?: string;
    status?: string;
  }): Promise<Trip[]> {
    return this.repository.search(params);
  }

  async getTripsByRouteAndDate(routeId: string, travelDate: string): Promise<Trip[]> {
    return this.repository.findByRouteAndDate(routeId, travelDate);
  }

  async cancelTrip(id: string): Promise<void> {
    const updated = await this.repository.cancelTrip(id);

    if (!updated) {
      throw new HttpError(404, 'Trip not found');
    }
  }
}

export const tripService = new TripService(tripRepository);
