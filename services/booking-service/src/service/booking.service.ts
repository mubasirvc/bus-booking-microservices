import { HttpError } from '@bus-booking/common';

import { Booking, CreateBookingInput, UpdateBookingInput } from '../types/booking.js';

import { BookingRepository, bookingRepository } from '../repository/booking.repostiory.js';

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
    if (input.seatCount <= 0) {
      throw new HttpError(400, 'Seat count must be greater than zero');
    }

    if (input.totalAmount <= 0) {
      throw new HttpError(400, 'Total amount must be greater than zero');
    }

    return this.repository.create(input);
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

    const cancelled = await this.repository.cancelBooking(id);

    if (!cancelled) {
      throw new HttpError(404, 'Booking not found');
    }

    return cancelled;
  }
}

export const bookingService = new BookingService(bookingRepository);
