import { HttpError } from '@bus-booking/common';

import {
  Booking,
  BookingStatus,
  CreateBookingInput,
} from '../types/booking.js';

import { BookingRepository, bookingRepository } from '../repository/booking.repostiory.js';
import inventoryGrpcService from './inventory-grpc.service.js';
import { logger } from '../utils/logger.js';
import paymentGrpcService from './payment-grpc.service.js';

import { publishBookingCreated, publishBookingUpdated } from '../messaging/event-publishing.js';
import { getRedisClient } from '../config/redis.js';

class BookingService {
  constructor(private readonly repository: BookingRepository) {}

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.repository.findAll();
  }

  async createBooking(input: CreateBookingInput): Promise<any> {
    let seatsReserved = false;

    try {
      const reservation = await inventoryGrpcService.reserveSeats(input.tripId, input.seats);

      seatsReserved = true;

      const totalAmount = reservation.fare * input.seats.length;

      const booking = await this.repository.create({
        ...input,
        totalAmount,
        status: BookingStatus.PENDING,
      });

      // publish booking created event for other services now for user service to store booking history

      publishBookingCreated({
        bookingId: booking.id,
        userId: booking.userId,
        tripId: booking.tripId,
        seats: booking.seats,
        status: booking.status!,
        totalPrice: totalAmount,
        busId: reservation.busId,
        busName: reservation.busName,
        source: reservation.source,
        destination: reservation.destination,
        travelDate: reservation.travelDate,
      });

      const payment = await paymentGrpcService.createPayment(booking.id, input.userId, totalAmount);

      const client = getRedisClient();

      await client.set(
        `booking:${booking.id}`,
        booking.id,
        'EX',
        600, // 10 minutes
      );

      logger.info(`Booking timer started for ${booking.id}`);

      return {
        booking,
        payment,
      };
    } catch (error) {
      if (seatsReserved) {
        await inventoryGrpcService.releaseSeats(input.tripId, input.seats);
      }

      throw error;
    }
  }

  async deleteBooking(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new HttpError(404, 'Booking not found');
    }
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return this.repository.findByUserId(userId);
  }

  async searchBookings(params: {
    userId?: string;
    tripId?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    page?: number;
    limit?: number;
  }) {
    return this.repository.search(params);
  }

  async cancelBooking(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.repository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    if (booking.userId !== userId) {
      throw new HttpError(403, 'Unauthorized');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new HttpError(400, 'Booking already cancelled');
    }

    const trip = await inventoryGrpcService.getTripById(booking.tripId);

    const now = new Date();

    if (trip.departureTime && trip.departureTime <= String(now)) {
      throw new HttpError(400, 'Cannot cancel after departure');
    }

    const client = getRedisClient();

    await client.del(`booking:${bookingId}`);

    await inventoryGrpcService.releaseSeats(booking.tripId, booking.seats);

    const cancelled = await this.repository.cancelBooking(bookingId);

    publishBookingUpdated({
      bookingId,
      status: BookingStatus.CANCELLED,
    });

    return cancelled!;
  }

  async updateBookingStatus(id: string, newStatus: BookingStatus): Promise<Booking> {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Ignore duplicate updates
    if (booking.status === newStatus) {
      logger.info(`Booking ${id} already ${newStatus}`);

      return booking;
    }

    // Terminal states
    if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.CANCELLED) {
      logger.warn(`Ignoring transition ${booking.status} -> ${newStatus}`);

      return booking;
    }

    // Only PENDING can transition
    if (booking.status !== BookingStatus.PENDING) {
      logger.warn(`Invalid current status ${booking.status}`);

      return booking;
    }

    // Only allow:
    // PENDING -> CONFIRMED
    // PENDING -> CANCELLED

    if (newStatus !== BookingStatus.CONFIRMED && newStatus !== BookingStatus.CANCELLED) {
      logger.warn(`Invalid target status ${newStatus}`);

      return booking;
    }

    const updated = await this.repository.updateBookingStatus(id, newStatus);

    if (!updated) {
      throw new HttpError(500, 'Failed to update booking');
    }

    const client = getRedisClient();

    // Remove timer for any final state
    await client.del(`booking:${id}`);

    if (newStatus === BookingStatus.CANCELLED) {
      await inventoryGrpcService.releaseSeats(booking.tripId, booking.seats);

      logger.info(`Released ${booking.seats.length} seats`);
    }

    publishBookingUpdated({
      bookingId: id,
      status: newStatus,
    });

    logger.info(`Booking ${id} updated to ${newStatus}`);

    return updated;
  }
}

export const bookingService = new BookingService(bookingRepository);
