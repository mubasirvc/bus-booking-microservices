import type { AsyncHandler } from '@bus-booking/common';

import { bookingService } from '../service/booking.service.js';

import {
  BookingIdParams,
  CreateBookingBody,
  SearchBookingsQuery,
  UpdateBookingBody,
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

export const updateBooking: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as BookingIdParams;

    const payload = req.body as UpdateBookingBody;

    const booking = await bookingService.updateBooking(id, payload);

    res.json({ data: booking });
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

    const bookings = await bookingService.searchBookings({
      userId: query.userId,
      tripId: query.tripId,
      status: query.status,
    });

    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as BookingIdParams;

    const booking = await bookingService.cancelBooking(id);

    res.json({ data: booking });
  } catch (error) {
    next(error);
  }
};
