import { asyncHandler, validateRequest } from '@bus-booking/common';

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

routeRoutes.get('/', asyncHandler(getAllRoutes));
routeRoutes.get( '/search', validateRequest({ query: searchRoutesQuerySchema }), asyncHandler(searchRoutes));
routeRoutes.get('/sources', asyncHandler(getAvailableSources));
routeRoutes.get('/destinations', asyncHandler(getAvailableDestinations));
routeRoutes.get('/source',validateRequest({  query: searchRoutesQuerySchema,}),asyncHandler(getRoutesBySource),);
routeRoutes.get('/destination',validateRequest({  query: searchRoutesQuerySchema,}),asyncHandler(getRoutesByDestination),);
routeRoutes.get('/:id',validateRequest({  params: routeIdParamsSchema,}),asyncHandler(getRoute),);
routeRoutes.post( '/', validateRequest({   body: createRouteSchema, }),asyncHandler(createRoute),);
routeRoutes.patch('/:id', validateRequest({   params: routeIdParamsSchema,   body: updateRouteSchema, }), asyncHandler(updateRoute),);
routeRoutes.delete('/:id', validateRequest({   params: routeIdParamsSchema, }),asyncHandler(deleteRoute));
