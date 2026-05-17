import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';

import {
  cancelBooking,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getBookingsByUser,
  searchBookings,
  updateBooking,
} from '../controller/booking.controller.js';

import {
  bookingIdParamsSchema,
  createBookingSchema,
  searchBookingsQuerySchema,
  updateBookingSchema,
} from '../validation/booking.schema.js';

export const bookingRoutes: Router = Router();

bookingRoutes.get('/', asyncHandler(getAllBookings));

bookingRoutes.get(
  '/search',
  validateRequest({
    query: searchBookingsQuerySchema,
  }),
  asyncHandler(searchBookings),
);

bookingRoutes.get(
  '/user',
  validateRequest({
    query: searchBookingsQuerySchema,
  }),
  asyncHandler(getBookingsByUser),
);

bookingRoutes.get(
  '/:id',
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(getBooking),
);

bookingRoutes.post(
  '/',
  validateRequest({
    body: createBookingSchema,
  }),
  asyncHandler(createBooking),
);

bookingRoutes.patch(
  '/:id',
  validateRequest({
    params: bookingIdParamsSchema,
    body: updateBookingSchema,
  }),
  asyncHandler(updateBooking),
);

bookingRoutes.patch(
  '/:id/cancel',
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(cancelBooking),
);

bookingRoutes.delete(
  '/:id',
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(deleteBooking),
);
