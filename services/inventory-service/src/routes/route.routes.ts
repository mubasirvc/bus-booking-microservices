import { asyncHandler, Role, validateRequest } from '@bus-booking/common';

import { Router } from 'express';

import {
  createRoute,
  deleteRoute,
  getAllRoutes,
  getAvailableDestinations,
  getAvailableSources,
  getRoute,
  getRoutesByDestination,
  getRoutesBySource,
  searchRoutes,
  updateRoute,
} from '../modules/route/index.js';

import {
  createRouteSchema,
  routeIdParamsSchema,
  searchRoutesQuerySchema,
  updateRouteSchema,
} from '../validation/route.schema.js';

export const routeRoutes: Router = Router();

import { requireRole } from '../middleware/require-role.js';

routeRoutes.get('/', asyncHandler(getAllRoutes));

routeRoutes.get(
  '/search',
  validateRequest({
    query: searchRoutesQuerySchema,
  }),
  asyncHandler(searchRoutes),
);

routeRoutes.get('/sources', asyncHandler(getAvailableSources));

routeRoutes.get('/destinations', asyncHandler(getAvailableDestinations));

routeRoutes.get(
  '/source',
  requireRole(Role.USER, Role.OPERATOR, Role.ADMIN),
  validateRequest({
    query: searchRoutesQuerySchema,
  }),
  asyncHandler(getRoutesBySource),
);

routeRoutes.get(
  '/destination',
  requireRole(Role.USER, Role.OPERATOR, Role.ADMIN),
  validateRequest({
    query: searchRoutesQuerySchema,
  }),
  asyncHandler(getRoutesByDestination),
);

routeRoutes.get(
  '/:id',
  validateRequest({
    params: routeIdParamsSchema,
  }),
  asyncHandler(getRoute),
);

routeRoutes.post(
  '/',
  requireRole(Role.ADMIN),
  validateRequest({
    body: createRouteSchema,
  }),
  asyncHandler(createRoute),
);

routeRoutes.patch(
  '/:id',
  requireRole(Role.ADMIN),
  validateRequest({
    params: routeIdParamsSchema,
    body: updateRouteSchema,
  }),
  asyncHandler(updateRoute),
);

routeRoutes.delete(
  '/:id',
  requireRole(Role.ADMIN),
  validateRequest({
    params: routeIdParamsSchema,
  }),
  asyncHandler(deleteRoute),
);
