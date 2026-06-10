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
    const user = getAuthenticatedUser(req);
    const { id } = bookingIdParamsSchema.parse(user, req.params);

    const response = await bookingProxyService.getBookingById(user, id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllBookings: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await bookingProxyService.getAllBookings(user,page, limit);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createBooking: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const payload = createBookingSchema.parse(req.body);

    const response = await bookingProxyService.createBooking(user, payload);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateBooking: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = bookingIdParamsSchema.parse(user, req.params);

    const payload = updateBookingSchema.parse(req.body);

    const response = await bookingProxyService.updateBooking(user, id, payload);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = bookingIdParamsSchema.parse(user, req.params);

    const response = await bookingProxyService.deleteBooking(user,id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = bookingIdParamsSchema.parse(user, req.params);

    const response = await bookingProxyService.cancelBooking(user,id);

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
    const user = getAuthenticatedUser(req);

    const response = await bookingProxyService.searchBookings(user, { ...query, page, limit } );

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
