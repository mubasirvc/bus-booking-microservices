import type { AsyncHandler } from '@bus-booking/common';

import { routeService } from '../service/route.service.js';

import {
  CreateRouteBody,
  RouteIdParams,
  SearchRoutesQuery,
  UpdateRouteBody,
} from '../../../validation/route.schema.js';

export const getRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as RouteIdParams;

    const route = await routeService.getRouteById(id);

    res.json({ data: route });
  } catch (error) {
    next(error);
  }
};

export const getAllRoutes: AsyncHandler = async (req, res, next) => {
  try {
    const routes = await routeService.getAllRoutes();

    res.json({ data: routes });
  } catch (error) {
    next(error);
  }
};

export const createRoute: AsyncHandler = async (req, res, next) => {
  try {
    const payload = req.body as CreateRouteBody;

    const route = await routeService.createRoute(payload);

    res.status(201).json({ data: route });
  } catch (error) {
    next(error);
  }
};

export const updateRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as RouteIdParams;
    const payload = req.body as UpdateRouteBody;

    const route = await routeService.updateRoute(id, payload);

    res.json({ data: route });
  } catch (error) {
    next(error);
  }
};

export const deleteRoute: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as RouteIdParams;

    await routeService.deleteRoute(id);

    res.json({
      message: 'Route deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const searchRoutes: AsyncHandler = async (req, res, next) => {
  try {
    const { query } = req.query as unknown as SearchRoutesQuery;

    const routes = await routeService.searchRoutes(query);

    res.json({ data: routes });
  } catch (error) {
    next(error);
  }
};

export const getRoutesBySource: AsyncHandler = async (req, res, next) => {
  try {
    const { query } = req.query as unknown as SearchRoutesQuery;

    const routes = await routeService.getRoutesBySource(query);

    res.json({ data: routes });
  } catch (error) {
    next(error);
  }
};

export const getRoutesByDestination: AsyncHandler = async (req, res, next) => {
  try {
    const { query } = req.query as unknown as SearchRoutesQuery;

    const routes = await routeService.getRoutesByDestination(query);

    res.json({ data: routes });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSources: AsyncHandler = async (req, res, next) => {
  try {
    const sources = await routeService.getAvailableSources();

    res.json({ data: sources });
  } catch (error) {
    next(error);
  }
};

export const getAvailableDestinations: AsyncHandler = async (req, res, next) => {
  try {
    const destinations = await routeService.getAvailableDestinations();

    res.json({ data: destinations });
  } catch (error) {
    next(error);
  }
};
