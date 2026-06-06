import { HttpError } from '@bus-booking/common';

import { myBookingRepository } from '../repositories/my-booking.repositories.js';
import { MyBookingPayload } from '../types/user.js';

export class MyBookingService {
  async getMyBookings(userId: string, status?: string, page = 1, limit = 10) {
    return await myBookingRepository.findByUserId(userId, status, page, limit);
  }

  async createBooking(payload: MyBookingPayload) {
    try {
      return await myBookingRepository.create(payload);
    } catch (error) {
      throw new HttpError(500, 'Failed to create booking');
    }
  }

  async getBookingDetails(userId: string, bookingId: string) {
    const booking = await myBookingRepository.findByBookingId(userId, bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    return booking;
  }

  async updateBookingStatus(bookingId: string, status: string) {
    const booking = await myBookingRepository.updateBookingByStatus(bookingId, status);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    return booking;
  }
}

export const myBookingService = new MyBookingService();
