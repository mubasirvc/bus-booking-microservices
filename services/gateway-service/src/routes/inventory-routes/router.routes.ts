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
} from '../../controllers/inventory-controllers/router.controller';

import {
  createRouteSchema,
  routeIdParamsSchema,
  searchRoutesQuerySchema,
  updateRouteSchema,
} from '../../validation/routes.schema';

export const routeRouter: Router = Router();

routeRouter.get('/', requireAuth, asyncHandler(getAllRoutes));

routeRouter.get('/search',requireAuth,validateRequest({  query: searchRoutesQuerySchema,}),asyncHandler(searchRoutes),);

routeRouter.get('/sources', requireAuth, asyncHandler(getSources));

routeRouter.get('/destinations', requireAuth, asyncHandler(getDestinations));

routeRouter.get('/:id',requireAuth, validateRequest({ params: routeIdParamsSchema,}),asyncHandler(getRoute),);

routeRouter.post('/',requireAuth, validateRequest({   body: createRouteSchema, }), asyncHandler(createRoute));

routeRouter.patch('/:id',requireAuth,validateRequest({  params: routeIdParamsSchema,  body: updateRouteSchema,}),asyncHandler(updateRoute),);

routeRouter.delete('/:id', requireAuth, validateRequest({   params: routeIdParamsSchema, }), asyncHandler(deleteRoute),);
