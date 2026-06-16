import { asyncHandler, Role, validateRequest } from '@bus-booking/common';
import { Router } from 'express';

import {
  createBus,
  deleteBus,
  getAllBuses,
  getBus,
  getMyBuses,
  searchBuses,
  updateBus,
} from '../modules/bus/controller/bus.controller.js';

import {
  busIdParamsSchema,
  createBusSchema,
  listBusQuerySchema,
  searchBusesQuerySchema,
  updateBusSchema,
} from '../validation/bus.schema.js';

export const busRoutes: Router = Router();

import { requireRole } from '../middleware/require-role.js';

busRoutes.get(
  '/',
  requireRole(Role.USER, Role.OPERATOR, Role.ADMIN),
  validateRequest({ query: listBusQuerySchema }),
  asyncHandler(getAllBuses),
);

busRoutes.get(
  '/search',
  requireRole(Role.USER, Role.OPERATOR, Role.ADMIN),
  validateRequest({ query: searchBusesQuerySchema }),
  asyncHandler(searchBuses),
);

busRoutes.get(
  '/my-buses',
  requireRole(Role.OPERATOR, Role.ADMIN),
  validateRequest({ query: listBusQuerySchema }),
  asyncHandler(getMyBuses),
);

busRoutes.get(
  '/:id',
  requireRole(Role.USER, Role.OPERATOR, Role.ADMIN),
  validateRequest({ params: busIdParamsSchema }),
  asyncHandler(getBus),
);

busRoutes.post(
  '/',
  requireRole(Role.OPERATOR, Role.ADMIN),
  validateRequest({ body: createBusSchema }),
  asyncHandler(createBus),
);

busRoutes.patch(
  '/:id',
  requireRole(Role.OPERATOR, Role.ADMIN),
  validateRequest({
    params: busIdParamsSchema,
    body: updateBusSchema,
  }),
  asyncHandler(updateBus),
);

busRoutes.delete(
  '/:id',
  requireRole(Role.ADMIN),
  validateRequest({
    params: busIdParamsSchema,
  }),
  asyncHandler(deleteBus),
);
