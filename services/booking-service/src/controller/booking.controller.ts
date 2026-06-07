import type { AsyncHandler } from '@bus-booking/common';

import { bookingService } from '../service/booking.service.js';

import {
  BookingIdParams,
  CreateBookingBody,
  SearchBookingsQuery,
} from '../validation/booking.schema.js';
import { BookingStatus } from '../types/booking.js';

export const getBooking: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as BookingIdParams;

    const booking = await bookingService.getBookingById(id);

    res.json({ data: booking });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings: AsyncHandler = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();

    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

export const createBooking: AsyncHandler = async (req, res, next) => {
  try {
    const payload = req.body as CreateBookingBody;

    const booking = await bookingService.createBooking({
      ...payload,
      status: BookingStatus.PENDING,
    });

    res.status(201).json({
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as BookingIdParams;

    await bookingService.deleteBooking(id);

    res.json({
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingsByUser: AsyncHandler = async (req, res, next) => {
  try {
    const query = req.query as unknown as SearchBookingsQuery;

    const bookings = await bookingService.getBookingsByUser(query.userId!);

    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

export const searchBookings: AsyncHandler = async (req, res, next) => {
  try {
    const query = req.query as unknown as SearchBookingsQuery;

    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const result = await bookingService.searchBookings({
      userId: query.userId,
      tripId: query.tripId,
      status: query.status,
      page,
      limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking: AsyncHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const { id } = req.params as unknown as BookingIdParams;

    const booking = await bookingService.cancelBooking(id, userId);

    res.json({ data: booking });
  } catch (error) {
    next(error);
  }
};
