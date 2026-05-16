import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import {
  cancelTrip,
  createTrip,
  deleteTrip,
  getAllTrips,
  getTrip,
  searchTrips,
  updateTrip,
} from '../../controllers/inventory-controllers/trip.controller.js';
import {
  createTripSchema,
  searchTripsQuerySchema,
  tripIdParamsSchema,
  updateTripSchema,
} from '../../validation/trip.schema.js';

export const tripRouter: Router = Router();

tripRouter.get('/', requireAuth, asyncHandler(getAllTrips));
tripRouter.get(
  '/search',
  requireAuth,
  validateRequest({ query: searchTripsQuerySchema }),
  asyncHandler(searchTrips),
);
tripRouter.get(
  '/:id',
  requireAuth,
  validateRequest({ params: tripIdParamsSchema }),
  asyncHandler(getTrip),
);
tripRouter.post(
  '/',
  requireAuth,
  validateRequest({ body: createTripSchema }),
  asyncHandler(createTrip),
);
tripRouter.patch(
  '/:id',
  requireAuth,
  validateRequest({ params: tripIdParamsSchema, body: updateTripSchema }),
  asyncHandler(updateTrip),
);
tripRouter.patch(
  '/:id/cancel',
  requireAuth,
  validateRequest({ params: tripIdParamsSchema }),
  asyncHandler(cancelTrip),
);
tripRouter.delete(
  '/:id',
  requireAuth,
  validateRequest({ params: tripIdParamsSchema }),
  asyncHandler(deleteTrip),
);
