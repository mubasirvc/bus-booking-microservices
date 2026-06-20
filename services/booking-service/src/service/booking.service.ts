import { HttpError } from '@bus-booking/common';
import { PaginatedResponse } from '@bus-booking/common';

import {
  Booking,
  BookingStatus,
  CreateBookingInput,
  ReservationDetails,
} from '../types/booking.js';

import { BookingRepository, bookingRepository } from '../repository/booking.repostiory.js';
import inventoryGrpcService, { TripDetails } from './inventory-grpc.service.js';
import { logger } from '../utils/logger.js';
import paymentGrpcService from './payment-grpc.service.js';

import {
  publishBookingPending,
  publishBookingCancelled,
  publishBookingConfirmed,
} from '../messaging/event-publishing.js';
import { getRedisClient } from '@bus-booking/common';


class BookingService {
  constructor(private readonly repository: BookingRepository) {}

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    return booking;
  }

  async getAllBookings(page: number, limit: number): Promise<PaginatedResponse<Booking>> {
    return this.repository.findAll(page, limit);
  }

  async createBooking(input: CreateBookingInput): Promise<any> {
    const isSeatAvailable = await inventoryGrpcService.reserveSeats(input.tripId, input.seats);

    if (!isSeatAvailable.success) {
      throw new HttpError(400, `Seats already booked: ${input.seats.join(', ')}`);
    }

    const booking = await this.repository.create({
      ...input,
      totalAmount: 0, // will be updated after seat reservation
      status: BookingStatus.PENDING,
    });

    // publish booking created event for other services now for user service to store booking history

    publishBookingPending({
      bookingId: booking.id,
      userId: booking.userId,
      tripId: booking.tripId,
      seats: booking.seats,
      status: booking.status!,
    });

    await getRedisClient().set(
      `booking:${booking.id}`,
      booking.id,
      'EX',
      600, // 10 minutes
    );

    logger.info(`Booking timer started for ${booking.id}`);

    return {
      booking,
    };
  }

  async handleSeatReservationSuccess(payload: ReservationDetails): Promise<void> {
    const booking = await this.repository.findById(payload.bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    const totalAmount = payload.fare * payload.seats.length;

    const payment = await paymentGrpcService.createPayment(booking.id, booking.userId, totalAmount);

    await this.repository.update(booking.id!, {
      totalAmount,
      paymentOrderId: payment.orderId,
      status: BookingStatus.AWAITING_PAYMENT,
    });

    logger.info({ bookingId: booking.id }, 'Seat reservation successful and payment order created');
  }

  async handleSeatReservationFailed(payload: {
    bookingId: string;
    userId: string;
    reason?: string;
    seats: string[];
    tripId: string;
  }): Promise<void> {
    await this.repository.update(payload.bookingId, {
      status: BookingStatus.CANCELLED,
    });

    publishBookingCancelled({
      bookingId: payload.bookingId,
      userId: payload.userId,
      reason: payload.reason,
      seats: payload.seats,
      tripId: payload.tripId,
      status: BookingStatus.CANCELLED,
    });
  }

  async handlePaymentSuccess(payload: { bookingId: string; userId: string }): Promise<void> {
    const booking = await this.repository.findById(payload.bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Ignore duplicate events
    if (booking.status === BookingStatus.CONFIRMED) {
      logger.info(`Booking ${booking.id} already confirmed`);
      return;
    }

    // Ignore invalid transitions
    if (booking.status === BookingStatus.CANCELLED) {
      logger.warn(`Ignoring payment success for cancelled booking ${booking.id}`);
      return;
    }

    if (booking.status !== BookingStatus.AWAITING_PAYMENT) {
      logger.warn(`Invalid transition ${booking.status} -> CONFIRMED`);
      return;
    }

    const updatedBooking = await this.repository.updateBookingStatus(
      booking.id,
      BookingStatus.CONFIRMED,
    );

    if (!updatedBooking) return;

    await getRedisClient().del(`booking:${booking.id}`);

    const trip = await inventoryGrpcService.getTripDetails(booking.tripId);

    const bookignDetails = this.buildBookingEventPayload(booking, trip);

    publishBookingConfirmed({
      ...bookignDetails,
      status: BookingStatus.CONFIRMED,
      totalPrice: booking.totalAmount,
    });

    logger.info(`Booking ${booking.id} confirmed successfully`);
  }

  async handlePaymentFailed(payload: {
    bookingId: string;
    userId: string;
    reason?: string;
  }): Promise<void> {
    const booking = await this.repository.findById(payload.bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Ignore duplicate events
    if (booking.status === BookingStatus.CANCELLED) {
      logger.info(`Booking ${booking.id} already cancelled`);
      return;
    }

    // Never cancel confirmed bookings
    if (booking.status === BookingStatus.CONFIRMED) {
      logger.warn(`Ignoring payment failure for confirmed booking ${booking.id}`);
      return;
    }

    if (booking.status !== BookingStatus.AWAITING_PAYMENT) {
      logger.warn(`Invalid transition ${booking.status} -> CANCELLED`);
      return;
    }

    const updatedBooking = await this.repository.updateBookingStatus(
      booking.id!,
      BookingStatus.CANCELLED,
    );

    console.log(updatedBooking, 'updated booking');
    await getRedisClient().del(`booking:${booking.id}`);

    const trip = await inventoryGrpcService.getTripDetails(booking.tripId);

    const bookignDetails = this.buildBookingEventPayload(booking, trip);
    console.log(trip, 'trip from cancell p');

    publishBookingCancelled({
      ...bookignDetails,
      totalPrice: booking.totalAmount,
      status: BookingStatus.CANCELLED,
      bookingId: booking.id!,
    });

    logger.info(`Booking ${booking.id} cancelled due to payment failure`);
  }

  // async createBooking(input: CreateBookingInput): Promise<any> {
  //   let seatsReserved = false;

  //   try {
  //     const reservation = await inventoryGrpcService.reserveSeats(input.tripId, input.seats);

  //     seatsReserved = true;

  //     const totalAmount = reservation.fare * input.seats.length;

  //     const booking = await this.repository.create({
  //       ...input,
  //       totalAmount,
  //       status: BookingStatus.PENDING,
  //     });

  //     // publish booking created event for other services now for user service to store booking history

  //     publishBookingPending({
  //       bookingId: booking.id,
  //       userId: booking.userId,
  //       tripId: booking.tripId,
  //       seats: booking.seats,
  //       status: booking.status!  ,
  //       totalPrice: totalAmount,
  //       busId: reservation.busId,
  //       busName: reservation.busName,
  //       source: reservation.source,
  //       destination: reservation.destination,
  //       travelDate: reservation.travelDate,
  //     });

  //     const payment = await paymentGrpcService.createPayment(booking.id, input.userId, totalAmount);

  //     // const client = getRedisClient();

  //     await getRedisClient().set(
  //       `booking:${booking.id}`,
  //       booking.id,
  //       'EX',
  //       600, // 10 minutes
  //     );

  //     logger.info(`Booking timer started for ${booking.id}`);

  //     return {
  //       booking,
  //       payment,
  //     };
  //   } catch (error) {
  //     if (seatsReserved) {
  //       await inventoryGrpcService.releaseSeats(input.tripId, input.seats);
  //     }

  //     throw error;
  //   }
  // }

  async deleteBooking(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new HttpError(404, 'Booking not found');
    }
  }

  async getBookingsByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Booking | null>> {
    return this.repository.findByUserId(userId, page, limit);
  }

  async searchBookings(params: {
    tripId?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Booking | null>> {
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

    const trip = await inventoryGrpcService.getTripDetails(booking.tripId);

    const now = new Date();
    if (trip.departureTime && new Date(trip.departureTime) <= new Date()) {
      throw new HttpError(400, 'Cannot cancel after departure');
    }

    await getRedisClient().del(`booking:${bookingId}`);

    // await inventoryGrpcService.releaseSeats(booking.tripId, booking.seats);

    const cancelled = await this.repository.cancelBooking(bookingId);

    const payload = this.buildBookingEventPayload(booking, trip);

    publishBookingCancelled({
      ...payload,
      bookingId: booking.id,
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

    // const client = getRedisClient();

    // Remove timer for any final state
    await getRedisClient().del(`booking:${id}`);

    if (newStatus === BookingStatus.CANCELLED) {
      await inventoryGrpcService.releaseSeats(booking.tripId, booking.seats);

      logger.info(`Released ${booking.seats.length} seats`);
    }

    const trip = await inventoryGrpcService.getTripDetails(booking.tripId);

    const payload = this.buildBookingEventPayload(booking, trip);

    if (newStatus === BookingStatus.CONFIRMED) {
      publishBookingConfirmed({
        ...payload,
        status: BookingStatus.CONFIRMED,
      });
    }

    if (newStatus === BookingStatus.CANCELLED) {
      publishBookingCancelled({
        ...payload,
        status: BookingStatus.CANCELLED,
      });
    }

    logger.info(`Booking ${id} updated to ${newStatus}`);

    return updated;
  }

  private buildBookingEventPayload(booking: Booking, trip: TripDetails) {
    return {
      seats: booking.seats,
      userId: booking.userId,
      totalPrice: booking.totalAmount,
      bookingId: booking.id,
      email: booking.email,
      tripId: trip.tripId,
      travelDate: trip.travelDate,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      busNumber: trip.busNumber,
      busName: trip.busName,
      busType: trip.busType,
      source: trip.source,
      destination: trip.destination,
    };
  }
}

export const bookingService = new BookingService(bookingRepository);
