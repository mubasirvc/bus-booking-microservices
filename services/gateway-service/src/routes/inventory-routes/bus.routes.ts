import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';

import { requireAuth } from '../../middleware/require-auth.js';

import {
  createBus,
  deleteBus,
  getAllBuses,
  getBus,
  getMyBuses,
  searchBuses,
  updateBus,
} from '../../controllers/inventory-controllers/bus.controller.js';

import {
  busIdParamsSchema,
  createBusSchema,
  listBusQuerySchema,
  searchBusesQuerySchema,
  updateBusSchema,
} from '../../validation/bus.schema.js';

export const busRouter: Router = Router();

busRouter.get('/', requireAuth, asyncHandler(getAllBuses));

busRouter.get(
  '/search',
  requireAuth,
  validateRequest({ query: searchBusesQuerySchema }),
  asyncHandler(searchBuses),
);

busRouter.get(
  '/my-buses',
  requireAuth,
  validateRequest({ query: listBusQuerySchema }),
  asyncHandler(getMyBuses),
);

busRouter.get(
  '/:id',
  requireAuth,
  validateRequest({ params: busIdParamsSchema }),
  asyncHandler(getBus),
);

busRouter.post(
  '/',
  requireAuth,
  validateRequest({ body: createBusSchema }),
  asyncHandler(createBus),
);

busRouter.patch(
  '/:id',
  requireAuth,
  validateRequest({
    params: busIdParamsSchema,
    body: updateBusSchema,
  }),
  asyncHandler(updateBus),
);

busRouter.delete(
  '/:id',
  requireAuth,
  validateRequest({ params: busIdParamsSchema }),
  asyncHandler(deleteBus),
);
