import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';

import { requireAuth } from '../middleware/require-auth.js';

import {
  cancelBooking,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getBookingsByUser,
  searchBookings,
  updateBooking,
} from '../controllers/booking-controller.js';

import {
  bookingIdParamsSchema,
  createBookingSchema,
  searchBookingsQuerySchema,
  updateBookingSchema,
} from '../validation/booking.schema.js';

export const bookingRouter: Router = Router();

bookingRouter.get('/', requireAuth, asyncHandler(getAllBookings));

bookingRouter.get(
  '/search',
  requireAuth,
  validateRequest({
    query: searchBookingsQuerySchema,
  }),
  asyncHandler(searchBookings),
);

bookingRouter.get(
  '/user',
  requireAuth,
  validateRequest({
    query: searchBookingsQuerySchema,
  }),
  asyncHandler(getBookingsByUser),
);

bookingRouter.get(
  '/:id',
  requireAuth,
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(getBooking),
);

bookingRouter.post(
  '/',
  requireAuth,
  validateRequest({
    body: createBookingSchema,
  }),
  asyncHandler(createBooking),
);

// bookingRouter.patch(
//   '/:id',
//   requireAuth,
//   validateRequest({
//     params: bookingIdParamsSchema,
//     body: updateBookingSchema,
//   }),
//   asyncHandler(updateBooking),
// );

bookingRouter.patch(
  '/:id/cancel',
  requireAuth,
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(cancelBooking),
);

// bookingRouter.delete(
//   '/:id',
//   requireAuth,
//   validateRequest({
//     params: bookingIdParamsSchema,
//   }),
//   asyncHandler(deleteBooking),
// );
