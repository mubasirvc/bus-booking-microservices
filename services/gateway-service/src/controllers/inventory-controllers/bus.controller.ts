import { AsyncHandler } from '@bus-booking/common';

import { busProxyService } from '../../services/inventor-services/bus-proxy.service.js';

import {
  busIdParamsSchema,
  createBusSchema,
  listBusQuerySchema,
  searchBusesQuerySchema,
  updateBusSchema,
} from '../../validation/bus.schema.js';
import { getAuthenticatedUser } from '../../utils/auth.js';

export const getBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = busIdParamsSchema.parse(req.params);
    const user = getAuthenticatedUser(req);

    const response = await busProxyService.getBusById(user,id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllBuses: AsyncHandler = async (req, res, next) => {
  try {
    const query = listBusQuerySchema.parse(req.query);
    const user = getAuthenticatedUser(req);
    const response = await busProxyService.getAllBuses(user, query);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getMyBuses: AsyncHandler = async (req, res, next) => {
  try {
    const query = listBusQuerySchema.parse(req.query);
    const user = getAuthenticatedUser(req);

    const response = await busProxyService.getMyBuses(user, query);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createBus: AsyncHandler = async (req, res, next) => {
  try {
    const payload = createBusSchema.parse(req.body);
    const user = getAuthenticatedUser(req);

    const response = await busProxyService.createBus(user, payload);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = busIdParamsSchema.parse(req.params);

    const payload = updateBusSchema.parse(req.body);

    const user = getAuthenticatedUser(req);
    const response = await busProxyService.updateBus(user, id, payload);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = busIdParamsSchema.parse(req.params);
    const user = getAuthenticatedUser(req);

    const response = await busProxyService.deleteBus(user, id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const searchBuses: AsyncHandler = async (req, res, next) => {
  try {
    const query = searchBusesQuerySchema.parse(req.query);
    const user = getAuthenticatedUser(req);

    const response = await busProxyService.searchBuses(user, query);

    res.json(response);
  } catch (error) {
    next(error);
  }
};
