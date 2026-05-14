import { asyncHandler, validateRequest } from '@bus-booking/common';
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

tripRoutes.get('/', asyncHandler(getAllTrips));
tripRoutes.get('/search', validateRequest({ query: searchTripsQuerySchema }), asyncHandler(searchTrips));
tripRoutes.get('/:id', validateRequest({ params: tripIdParamsSchema }), asyncHandler(getTrip));
tripRoutes.post('/', validateRequest({ body: createTripSchema }), asyncHandler(createTrip));
tripRoutes.patch('/:id', validateRequest({ params: tripIdParamsSchema, body: updateTripSchema }), asyncHandler(updateTrip));
tripRoutes.patch('/:id/cancel', validateRequest({ params: tripIdParamsSchema }), asyncHandler(cancelTrip));
tripRoutes.delete('/:id', validateRequest({ params: tripIdParamsSchema }), asyncHandler(deleteTrip));