import { AsyncHandler } from '@bus-booking/common';

import { bookingProxyService } from '../services/booking-service.js';

import {
  bookingIdParamsSchema,
  createBookingSchema,
  searchBookingsQuerySchema,
  updateBookingSchema,
} from '../validation/booking.schema.js';
import { getAuthenticatedUser } from '../utils/auth.js';

export const getBooking: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = bookingIdParamsSchema.parse(req.params);

    const response = await bookingProxyService.getBookingById(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllBookings: AsyncHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await bookingProxyService.getAllBookings(page, limit);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createBooking: AsyncHandler = async (req, res, next) => {
  try {
    const payload = createBookingSchema.parse(req.body);

    const response = await bookingProxyService.createBooking(payload);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateBooking: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = bookingIdParamsSchema.parse(req.params);

    const payload = updateBookingSchema.parse(req.body);

    const response = await bookingProxyService.updateBooking(id, payload);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = bookingIdParamsSchema.parse(req.params);

    const response = await bookingProxyService.deleteBooking(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = bookingIdParamsSchema.parse(req.params);

    const response = await bookingProxyService.cancelBooking(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const searchBookings: AsyncHandler = async (req, res, next) => {
  try {
    const query = searchBookingsQuerySchema.parse(req.query);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await bookingProxyService.searchBookings({ ...query, page, limit } );

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getBookingsByUser: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const query = searchBookingsQuerySchema.parse(req.query);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await bookingProxyService.getBookingsByUser(user, page, limit);

    res.json(response);
  } catch (error) {
    next(error);
  }
};
