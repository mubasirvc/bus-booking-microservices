import { HttpError } from '@bus-booking/common';

import {
  Booking,
  BookingStatus,
  CreateBookingInput,
  UpdateBookingInput,
} from '../types/booking.js';

import { BookingRepository, bookingRepository } from '../repository/booking.repostiory.js';
import inventoryGrpcService from './inventory-grpc.service.js';
import { logger } from '../utils/logger.js';
import paymentGrpcService from './payment-grpc.service.js';

import { client } from '../config/redis.js';
import { publishBookingCreated } from '../messaging/event-publishing.js';

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
      const reservation = await inventoryGrpcService.reserveSeats(input.tripId, input.seats.length);

      seatsReserved = true;

      const totalAmount = reservation.fare * input.seats.length;

      logger.info(
        `Reserved ${input.seats.length} seats for trip ${input.tripId}. Remaining seats: ${reservation.remainingSeats}`,
      );

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

      await client.set(
        `booking:${booking.id}`,
        booking.id,
        'EX',
        900, // 15 minutes
      );

      logger.info(`Booking timer started for ${booking.id}`);

      return {
        booking,
        payment,
      };
    } catch (error) {
      if (seatsReserved) {
        await inventoryGrpcService.releaseSeats(input.tripId, input.seats.length);
      }

      throw error;
    }
  }

  async updateBooking(id: string, input: UpdateBookingInput): Promise<Booking> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new HttpError(404, 'Booking not found');
    }

    const updated = await this.repository.update(id, input);

    if (!updated) {
      throw new HttpError(404, 'Booking not found');
    }

    return updated;
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
  }): Promise<Booking[]> {
    return this.repository.search(params);
  }

  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new HttpError(400, 'Booking already cancelled');
    }

    await inventoryGrpcService.releaseSeats(booking.tripId, booking.seats.length);

    const cancelled = await this.repository.cancelBooking(id);

    if (!cancelled) {
      throw new HttpError(404, 'Booking not found');
    }

    return cancelled;
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // avoid duplicate webhook updates
    if (booking.status === status) {
      logger.info(`Booking ${id} already ${status}`);

      return booking;
    }

    const updated = await this.repository.updateBookingStatus(id, status);

    if (!updated) {
      throw new HttpError(404, 'Failed to update booking');
    }

    logger.info(`Booking ${id} updated to ${status}`);

    // if booking is confirmed, remove the expiry timer

    if (status === 'CONFIRMED') {
      await client.del(`booking:${id}`);

      logger.info(`Booking timer removed: ${id}`);
    }

    // release seats only when cancelled

    if (status === 'CANCELLED') {
      await inventoryGrpcService.releaseSeats(booking.tripId, booking.seats.length);

      logger.info(`Released ${booking.seats.length} seats for trip ${booking.tripId}`);
    }

    return updated;
  }

  async getSeats(tripId: number): Promise<number> {
    const seats = await inventoryGrpcService.getAvailableSeats(tripId.toString());

    return seats;
  }
}

export const bookingService = new BookingService(bookingRepository);
