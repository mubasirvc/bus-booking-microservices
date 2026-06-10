import { asyncHandler, validateRequest } from '@bus-booking/common';
import { Router } from 'express';

import { requireAuth } from '../../middleware/require-auth';

import {
  createRoute,
  deleteRoute,
  getAllRoutes,
  getDestinations,
  getRoute,
  getSources,
  searchRoutes,
  updateRoute,
} from '../../controllers/inventory-controllers/route.controller';

import {
  createRouteSchema,
  routeIdParamsSchema,
  searchRoutesQuerySchema,
  updateRouteSchema,
} from '../../validation/routes.schema';

export const routeRouter: Router = Router();

routeRouter.get('/',  asyncHandler(getAllRoutes));

routeRouter.get('/search',validateRequest({  query: searchRoutesQuerySchema,}),asyncHandler(searchRoutes),);

routeRouter.get('/sources',  asyncHandler(getSources));

routeRouter.get('/destinations',  asyncHandler(getDestinations));

routeRouter.get('/:id', validateRequest({ params: routeIdParamsSchema,}),asyncHandler(getRoute),);

routeRouter.post('/', requireAuth, validateRequest({   body: createRouteSchema, }), asyncHandler(createRoute));

routeRouter.patch('/:id',requireAuth, validateRequest({  params: routeIdParamsSchema,  body: updateRouteSchema,}),asyncHandler(updateRoute),);

routeRouter.delete('/:id',  requireAuth, validateRequest({   params: routeIdParamsSchema, }), asyncHandler(deleteRoute),);
