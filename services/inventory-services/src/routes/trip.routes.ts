import { asyncHandler, Role, validateRequest } from '@bus-booking/common';
import { Router } from 'express';
import {
  cancelTrip,
  createTrip,
  deleteTrip,
  getAllTrips,
  getTrip,
  searchTrips,
  updateTrip,
} from '../modules/trip/index.js';
import {
  createTripSchema,
  searchTripsQuerySchema,
  tripIdParamsSchema,
  updateTripSchema,
} from '../validation/trip.schema.js';

export const tripRoutes: Router = Router();

import { requireRole } from '../middleware/require-role.js';

tripRoutes.get('/', asyncHandler(getAllTrips));

tripRoutes.get(
  '/search',
  validateRequest({
    query: searchTripsQuerySchema,
  }),
  asyncHandler(searchTrips),
);

tripRoutes.get(
  '/:id',
  requireRole(Role.USER, Role.OPERATOR, Role.ADMIN),
  validateRequest({
    params: tripIdParamsSchema,
  }),
  asyncHandler(getTrip),
);

tripRoutes.post(
  '/',
  requireRole(Role.OPERATOR, Role.ADMIN),
  validateRequest({
    body: createTripSchema,
  }),
  asyncHandler(createTrip),
);

tripRoutes.patch(
  '/:id',
  validateRequest({
    params: tripIdParamsSchema,
    body: updateTripSchema,
  }),
  asyncHandler(updateTrip),
);

tripRoutes.patch(
  '/:id/cancel',
  requireRole(Role.OPERATOR, Role.ADMIN),
  validateRequest({
    params: tripIdParamsSchema,
  }),
  asyncHandler(cancelTrip),
);

tripRoutes.delete(
  '/:id',
  requireRole(Role.ADMIN),
  validateRequest({
    params: tripIdParamsSchema,
  }),
  asyncHandler(deleteTrip),
);