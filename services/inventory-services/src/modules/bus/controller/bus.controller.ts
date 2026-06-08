import type { AsyncHandler } from '@bus-booking/common';

import { busService } from '../service/bus.service.js';

import {
  BusIdParams,
  CreateBusBody,
  SearchBusesQuery,
  UpdateBusBody,
  GetAllBusesQuery,
} from '../../../validation/bus.schema.js';

export const getBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as BusIdParams;

    const bus = await busService.getBusById(id);

    res.json({ data: bus });
  } catch (error) {
    next(error);
  }
};

export const getAllBuses: AsyncHandler = async (req, res, next) => {
  try {
    let { page, limit } = req.query as unknown as GetAllBusesQuery;

    page = parseInt(String(req.query.page)) || 1;
    limit = parseInt(String(req.query.limit)) || 10;

    const buses = await busService.getAllBuses({ page, limit });

    res.json({ data: buses });
  } catch (error) {
    next(error);
  }
};

export const getMyBuses: AsyncHandler = async (req, res, next) => {
  try {
    const operatorId = req.headers['x-user-id'] as string;

    const page = Number(req.query.page) || 1;

    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const result = await busService.getBusesByOperator(operatorId, page, limit);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createBus: AsyncHandler = async (req, res, next) => {
  try {
    const payload = req.body as CreateBusBody;
    const operatorId = req.headers['x-user-id'] as string;
    const bus = await busService.createBus({ ...payload, operatorId });

    res.status(201).json({ data: bus });
  } catch (error) {
    next(error);
  }
};

export const updateBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as BusIdParams;

    const payload = req.body as UpdateBusBody;
    const operatorId = req.headers['x-user-id'] as string;

    const bus = await busService.updateBus(id,  operatorId, payload);

    res.json({ data: bus });
  } catch (error) {
    next(error);
  }
};

export const deleteBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as BusIdParams;

    await busService.deleteBus(id);

    res.json({
      message: 'Bus deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const searchBuses: AsyncHandler = async (req, res, next) => {
  try {
    const { name, type } = req.query as unknown as SearchBusesQuery;

    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 10;

    const buses = await busService.searchBuses({
      limit,
      page,
      name,
      type,
    });

    res.json({ data: buses });
  } catch (error) {
    next(error);
  }
};
