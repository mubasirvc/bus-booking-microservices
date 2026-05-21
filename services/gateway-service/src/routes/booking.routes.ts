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

bookingRouter.get('/',  asyncHandler(getAllBookings));

bookingRouter.get(
  '/search',
  
  validateRequest({
    query: searchBookingsQuerySchema,
  }),
  asyncHandler(searchBookings),
);

bookingRouter.get(
  '/user',
  
  validateRequest({
    query: searchBookingsQuerySchema,
  }),
  asyncHandler(getBookingsByUser),
);

bookingRouter.get(
  '/:id',
  
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(getBooking),
);

bookingRouter.post(
  '/',
  
  validateRequest({
    body: createBookingSchema,
  }),
  asyncHandler(createBooking),
);

bookingRouter.patch(
  '/:id',
  
  validateRequest({
    params: bookingIdParamsSchema,
    body: updateBookingSchema,
  }),
  asyncHandler(updateBooking),
);

bookingRouter.patch(
  '/:id/cancel',
  
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(cancelBooking),
);

bookingRouter.delete(
  '/:id',
  
  validateRequest({
    params: bookingIdParamsSchema,
  }),
  asyncHandler(deleteBooking),
);
