import { AsyncHandler } from '@bus-booking/common';

import { inventoryProxyService } from '../../services/inventory-proxy.service';

import {
  createRouteSchema,
  routeIdParamsSchema,
  updateRouteSchema,
  searchRoutesQuerySchema,
  type SearchRoutesQuery,
} from '../../validation/routes.schema';

/* GET /routes/:id */

export const getRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = routeIdParamsSchema.parse(req.params);

    const response = await inventoryProxyService.getRouteById(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

/* GET /routes */

export const getAllRoutes: AsyncHandler = async (req, res, next) => {
  try {
    const response = await inventoryProxyService.getAllRoutes();

    res.json(response);
  } catch (error) {
    next(error);
  }
};

/* POST /routes */

export const createRoute: AsyncHandler = async (req, res, next) => {
  try {
    const payload = createRouteSchema.parse(req.body);

    const response = await inventoryProxyService.createRoute(payload);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};


/* PATCH /routes/:id */

export const updateRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = routeIdParamsSchema.parse(req.params);

    const payload = updateRouteSchema.parse(req.body);

    const response = await inventoryProxyService.updateRoute(id, payload);

    res.json(response);
  } catch (error) {
    next(error);
  }
};


/* DELETE /routes/:id */

export const deleteRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = routeIdParamsSchema.parse(req.params);

    const response = await inventoryProxyService.deleteRoute(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};


/* GET /routes/search */

export const searchRoutes: AsyncHandler = async (req, res, next) => {
  try {
    const parsedQuery: SearchRoutesQuery = searchRoutesQuerySchema.parse(req.query);

    const response = await inventoryProxyService.searchRoutes(parsedQuery.query);

    res.json(response);
  } catch (error) {
    next(error);
  }
};


/* GET /routes/sources */

export const getSources: AsyncHandler = async (req, res, next) => {
  try {
    const response = await inventoryProxyService.getSources();

    res.json(response);
  } catch (error) {
    next(error);
  }
};


/* GET /routes/destinations */

export const getDestinations: AsyncHandler = async (req, res, next) => {
  try {
    const response = await inventoryProxyService.getDestinations();

    res.json(response);
  } catch (error) {
    next(error);
  }
};
