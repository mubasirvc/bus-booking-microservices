import { AsyncHandler } from '@bus-booking/common';

import { inventoryProxyService } from '../../services/inventory-proxy.service.js';

import {
  busIdParamsSchema,
  createBusSchema,
  searchBusesQuerySchema,
  updateBusSchema,
} from '../../validation/bus.schema.js';

export const getBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = busIdParamsSchema.parse(req.params);

    const response = await inventoryProxyService.getBusById(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllBuses: AsyncHandler = async (req, res, next) => {
  try {
    const response = await inventoryProxyService.getAllBuses();

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createBus: AsyncHandler = async (req, res, next) => {
  try {
    const payload = createBusSchema.parse(req.body);

    const response = await inventoryProxyService.createBus(payload);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = busIdParamsSchema.parse(req.params);

    const payload = updateBusSchema.parse(req.body);

    const response = await inventoryProxyService.updateBus(id, payload);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = busIdParamsSchema.parse(req.params);

    const response = await inventoryProxyService.deleteBus(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const searchBuses: AsyncHandler = async (req, res, next) => {
  try {
    const query = searchBusesQuerySchema.parse(req.query);

    const response = await inventoryProxyService.searchBuses(query);

    res.json(response);
  } catch (error) {
    next(error);
  }
};
