import { HttpError, PaginatedResponse } from '@bus-booking/common';

import { Trip, CreateTripInput, UpdateTripInput } from '../types/trip.types.js';

import { TripRepository, tripRepository } from '../repository/trip.repository.js';
import { busRepository, BusRepository } from '../../bus/repository/bus.repository.js';
import { routeRepository, RouteRepository } from '../../route/repository/route.repository.js';
import {
  publishSeatReservationFailed,
  publishSeatReservationSuccess,
} from '../../../messaging/event-publishing.js';
import { logger } from '../../../utils/logger.js';

class TripService {
  constructor(
    private readonly repository: TripRepository,
    private busRepository: BusRepository,
    private routeRepository: RouteRepository,
  ) {}

  async getTripById(id: string): Promise<Trip> {
    const trip = await this.repository.findById(id);

    if (!trip) {
      throw new HttpError(404, 'Trip not found');
    }

    return trip;
  }

  async getTripDetails(id: string) {
    const trip = await this.repository.findById(id);

    if (!trip) {
      throw new HttpError(404, 'Trip not found');
    }

    const bus = await this.busRepository.findById(trip.busId);

    if (!bus) {
      throw new HttpError(404, 'Bus not found for this trip');
    }

    const route = await this.routeRepository.findById(trip.routeId);

    if (!route) {
      throw new HttpError(404, 'Route not found for this trip');
    }

    return {
      tripId: trip.id,
      travelDate: trip.travelDate,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      busId: trip.busId,
      busNumber: bus.busNumber,
      busName: bus.name,
      busType: bus.type,
      source: route.source,
      destination: route.destination,
    };
  }

  async getAllTrips(page: number, limit: number): Promise<PaginatedResponse<Trip>> {
    return this.repository.findAll(page, limit);
  }

  async createTrip(input: CreateTripInput): Promise<Trip> {
    if (new Date(input.arrivalTime) <= new Date(input.departureTime)) {
      throw new HttpError(400, 'Arrival time must be after departure time');
    }

    if (input.fare <= 0) {
      throw new HttpError(400, 'Fare must be greater than zero');
    }

    const bus = await this.busRepository.findById(input.busId);

    if (!bus) {
      throw new HttpError(404, 'Bus not found');
    }

    return this.repository.create({
      ...input,
      bookedSeats: [],
      availableSeats: bus.totalSeats,
      status: 'ACTIVE',
    });
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
    page: number;
    limit: number;
  }): Promise<PaginatedResponse<Trip>> {
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

  async reserveSeats(payload: {
    bookingId: string;
    tripId: string;
    seats: string[];
    userId: string;
  }) {
    const { bookingId, tripId, seats, userId } = payload;
    const trip = await this.repository.findById(tripId);

    if (!trip) {
      throw new Error('Trip not found');
    }

    const alreadyBooked = trip.bookedSeats?.filter((seat) => seats.includes(seat)) ?? [];

    if (alreadyBooked.length > 0) {
      throw new Error(`Seats already booked: ${alreadyBooked.join(', ')}`);
    }

    const bus = await this.busRepository.findById(trip.busId);

    if (!bus) {
      throw new Error('Bus not found');
    }

    const route = await this.routeRepository.findById(trip.routeId);

    if (!route) {
      throw new Error('Route not found');
    }

    const updatedBookedSeats = [...(trip.bookedSeats ?? []), ...seats];

    const remainingSeats = trip.availableSeats - seats.length;

    await this.repository.updateSeatState(tripId, remainingSeats, updatedBookedSeats);

    return {
      bookingId,
      userId,
      tripId,
      seats,
      fare: trip.fare,
      remainingSeats,
      busId: bus.id!,
      busName: bus.name,
      source: route.source,
      destination: route.destination,
      travelDate: trip.travelDate,
    };
  }

  async releaseSeats(tripId: string, seats: string[]) {

    logger.info(tripId + 'trip id from release seat')
    
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

export const tripService = new TripService(tripRepository, busRepository, routeRepository);
