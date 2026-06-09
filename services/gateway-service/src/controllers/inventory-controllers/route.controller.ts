import { AsyncHandler } from '@bus-booking/common';

import { routeProxyService } from '../../services/inventor-services/route-proxy.service';

import {
  createRouteSchema,
  routeIdParamsSchema,
  updateRouteSchema,
  searchRoutesQuerySchema,
  type SearchRoutesQuery,
} from '../../validation/routes.schema';


export const getRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = routeIdParamsSchema.parse(req.params);

    const response = await routeProxyService.getRouteById(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};


export const getAllRoutes: AsyncHandler = async (req, res, next) => {
  try {
    const response = await routeProxyService.getAllRoutes();

    res.json(response);
  } catch (error) {
    next(error);
  }
};


export const createRoute: AsyncHandler = async (req, res, next) => {
  try {
    const payload = createRouteSchema.parse(req.body);

    const response = await routeProxyService.createRoute(payload);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};



export const updateRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = routeIdParamsSchema.parse(req.params);

    const payload = updateRouteSchema.parse(req.body);

    const response = await routeProxyService.updateRoute(id, payload);

    res.json(response);
  } catch (error) {
    next(error);
  }
};



export const deleteRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = routeIdParamsSchema.parse(req.params);

    const response = await routeProxyService.deleteRoute(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};



export const searchRoutes: AsyncHandler = async (req, res, next) => {
  try {
    const parsedQuery: SearchRoutesQuery = searchRoutesQuerySchema.parse(req.query);

    const response = await routeProxyService.searchRoutes(parsedQuery.query);

    res.json(response);
  } catch (error) {
    next(error);
  }
};



export const getSources: AsyncHandler = async (req, res, next) => {
  try {
    const response = await routeProxyService.getSources();

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getDestinations: AsyncHandler = async (req, res, next) => {
  try {
    const response = await routeProxyService.getDestinations();

    res.json(response);
  } catch (error) {
    next(error);
  }
};
