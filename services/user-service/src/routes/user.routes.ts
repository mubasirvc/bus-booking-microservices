import { asyncHandler, Role, validateRequest } from '@bus-booking/common';
import { Router } from 'express';
import { createUser, getAllUsers, getUser, searchUsers } from '../controllers/user.controller.js';
import {
  createUserSchema,
  searchUsersQuerySchema,
  userIdParamsSchema,
} from '../validation/user.schema.js';
import { getMyBookings, getBookingDetails } from '../controllers/my-booking.controller.js';
import { requireRole } from '../middleware/require-role.js';

export const userRoutes: Router = Router();

userRoutes.get('/my-bookings', requireRole(Role.USER, Role.ADMIN), asyncHandler(getMyBookings));

userRoutes.get(
  '/my-bookings/:bookingId',
  requireRole(Role.USER, Role.ADMIN),
  asyncHandler(getBookingDetails),
);

userRoutes.get('/', requireRole(Role.ADMIN), asyncHandler(getAllUsers));

userRoutes.get(
  '/search',
  requireRole(Role.ADMIN),
  validateRequest({
    query: searchUsersQuerySchema,
  }),
  asyncHandler(searchUsers),
);

userRoutes.get(
  '/:id',
  requireRole(Role.ADMIN),
  validateRequest({
    params: userIdParamsSchema,
  }),
  asyncHandler(getUser),
);

userRoutes.post(
  '/',
  requireRole(Role.ADMIN),
  validateRequest({
    body: createUserSchema,
  }),
  asyncHandler(createUser),
);
