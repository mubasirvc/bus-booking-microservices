import { AsyncHandler } from '@bus-booking/common';

import { bookingProxyService } from '../services/booking-service.js';

import {
  bookingIdParamsSchema,
  createBookingSchema,
  searchBookingsQuerySchema,
  updateBookingSchema,
} from '../validation/booking.schema.js';

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
    const response = await bookingProxyService.getAllBookings();

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

    const response = await bookingProxyService.searchBookings(query);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getBookingsByUser: AsyncHandler = async (req, res, next) => {
  try {
    const query = searchBookingsQuerySchema.parse(req.query);

    const response = await bookingProxyService.getBookingsByUser(query.userId!);

    res.json(response);
  } catch (error) {
    next(error);
  }
};
