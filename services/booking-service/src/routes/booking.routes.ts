import { asyncHandler, Role, validateRequest } from '@bus-booking/common';
import { Router } from 'express';

import {
  cancelBooking,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getBookingsByUser,
  searchBookings,
} from '../controller/booking.controller.js';

import {
  bookingIdParamsSchema,
  createBookingSchema,
  searchBookingsQuerySchema,
  updateBookingSchema,
} from '../validation/booking.schema.js';
import { requireRole } from '../middleware/require-role.js';

export const bookingRoutes: Router = Router();

bookingRoutes.get(
  '/search',
  requireRole(Role.ADMIN, Role.OPERATOR),
  validateRequest({
    query: searchBookingsQuerySchema,
  }),
  asyncHandler(searchBookings),
);

bookingRoutes.get('/', requireRole(Role.ADMIN), asyncHandler(getAllBookings));

bookingRoutes.get(
  '/user',
  requireRole(Role.USER, Role.ADMIN),
  validateRequest({
    query: searchBookingsQuerySchema,
  }),
  asyncHandler(getBookingsByUser),
);

bookingRoutes.get(
  '/:id',
  requireRole(Role.ADMIN, Role.USER, Role.OPERATOR),
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(getBooking),
);

bookingRoutes.post(
  '/',
  requireRole(Role.USER),
  validateRequest({
    body: createBookingSchema,
  }),
  asyncHandler(createBooking),
);

bookingRoutes.patch(
  '/:id/cancel',
  requireRole(Role.USER, Role.ADMIN),
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(cancelBooking),
);

// bookingRoutes.delete(
//   '/:id',
//   requireRole('ADMIN'),
//   validateRequest({
//     params: bookingIdParamsSchema,
//   }),
//   asyncHandler(deleteBooking),
// );
