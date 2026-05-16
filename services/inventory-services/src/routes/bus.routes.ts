import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';

import {
  createBus,
  deleteBus,
  getAllBuses,
  getBus,
  searchBuses,
  updateBus,
} from '../modules/bus/controller/bus.controller.js';

import {
  busIdParamsSchema,
  createBusSchema,
  searchBusesQuerySchema,
  updateBusSchema,
} from '../validation/bus.schema.js';

export const busRoutes: Router = Router();

busRoutes.get('/', asyncHandler(getAllBuses));

busRoutes.get(
  '/search',
  validateRequest({ query: searchBusesQuerySchema }),
  asyncHandler(searchBuses),
);

busRoutes.get('/:id', validateRequest({ params: busIdParamsSchema }), asyncHandler(getBus));

busRoutes.post('/', validateRequest({ body: createBusSchema }), asyncHandler(createBus));

busRoutes.patch(
  '/:id',
  validateRequest({
    params: busIdParamsSchema,
    body: updateBusSchema,
  }),
  asyncHandler(updateBus),
);

busRoutes.delete('/:id', validateRequest({ params: busIdParamsSchema }), asyncHandler(deleteBus));
