import { HttpError } from '@bus-booking/common';

import { Booking, CreateBookingInput, UpdateBookingInput } from '../types/booking.js';

import { BookingRepository, bookingRepository } from '../repository/booking.repostiory.js';
import inventoryGrpcService from './inventory-grpc.service.js';
import { logger } from '../utils/logger.js';

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

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    let seatsReserved = false;

    try {
      if (input.seatCount <= 0) {
        throw new HttpError(400, 'Seat count must be greater than zero');
      }

      if (input.seatCount > 4) {
        throw new HttpError(400, 'Cannot book more than 4 seats at a time');
      }

      const reservation = await inventoryGrpcService.reserveSeats(input.tripId, input.seatCount);

      seatsReserved = true;

      logger.info(reservation, 'Seat reservation successful');

      const totalAmount = reservation.fare * input.seatCount;

      const paymentSuccess = true;

      const booking = await this.repository.create({
        ...input,
        totalAmount,
        status: paymentSuccess ? 'CONFIRMED' : 'CANCELLED',
      });

      if (!paymentSuccess) {
        throw new HttpError(400, 'Payment failed');
      }

      return booking;
    } catch (error) {
      logger.error(error, 'Error creating booking');

      if (seatsReserved) {
        const res = await inventoryGrpcService.releaseSeats(input.tripId, input.seatCount);

        logger.info(res, 'Seats released due to payment failure');
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
    status?: string;
  }): Promise<Booking[]> {
    return this.repository.search(params);
  }

  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    if (booking.status === 'CANCELLED') {
      throw new HttpError(400, 'Booking already cancelled');
    }

    await inventoryGrpcService.releaseSeats(booking.tripId, booking.seatCount);

    const cancelled = await this.repository.cancelBooking(id);

    if (!cancelled) {
      throw new HttpError(404, 'Booking not found');
    }

    return cancelled;
  }

  async getSeats(tripId: number): Promise<number> {
    const seats = await inventoryGrpcService.getAvailableSeats(tripId.toString());

    return seats;
  }
}

export const bookingService = new BookingService(bookingRepository);
