import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';

import { requireAuth} from '../../middleware/require-auth.js';

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

busRouter.get('/',  asyncHandler(getAllBuses));

busRouter.get(
  '/search',
  
  validateRequest({ query: searchBusesQuerySchema }),
  asyncHandler(searchBuses),
);

busRouter.get(
  '/my-buses',
  
  validateRequest({ query: listBusQuerySchema }),
  asyncHandler(getMyBuses),
);

busRouter.get(
  '/:id',
  
  validateRequest({ params: busIdParamsSchema }),
  asyncHandler(getBus),
);

busRouter.post(
  '/',
 
  validateRequest({ body: createBusSchema }),
  asyncHandler(createBus),
);

busRouter.patch(
  '/:id',
  
  validateRequest({
    params: busIdParamsSchema,
    body: updateBusSchema,
  }),
  asyncHandler(updateBus),
);

busRouter.delete(
  '/:id',
  
  validateRequest({ params: busIdParamsSchema }),
  asyncHandler(deleteBus),
);
