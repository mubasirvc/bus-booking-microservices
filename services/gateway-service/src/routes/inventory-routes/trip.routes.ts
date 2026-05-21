import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';
import { } from '../../middleware/require-auth.js';
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

tripRouter.get('/', asyncHandler(getAllTrips));
tripRouter.get(
  '/search',
  
  validateRequest({ query: searchTripsQuerySchema }),
  asyncHandler(searchTrips),
);
tripRouter.get(
  '/:id',
  
  validateRequest({ params: tripIdParamsSchema }),
  asyncHandler(getTrip),
);
tripRouter.post(
  '/',

  validateRequest({ body: createTripSchema }),
  asyncHandler(createTrip),
);
tripRouter.patch(
  '/:id',
  
  validateRequest({ params: tripIdParamsSchema, body: updateTripSchema }),
  asyncHandler(updateTrip),
);
tripRouter.patch(
  '/:id/cancel',
  
  validateRequest({ params: tripIdParamsSchema }),
  asyncHandler(cancelTrip),
);
tripRouter.delete(
  '/:id',
  
  validateRequest({ params: tripIdParamsSchema }),
  asyncHandler(deleteTrip),
);
