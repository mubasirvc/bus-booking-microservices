import type { AsyncHandler } from '@bus-booking/common';

import { busService } from '../service/bus.service.js';

import {
  BusIdParams,
  CreateBusBody,
  SearchBusesQuery,
  UpdateBusBody,
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
    const buses = await busService.getAllBuses();

    res.json({ data: buses });
  } catch (error) {
    next(error);
  }
};

export const createBus: AsyncHandler = async (req, res, next) => {
  try {
    const payload = req.body as CreateBusBody;

    const bus = await busService.createBus(payload);

    res.status(201).json({ data: bus });
  } catch (error) {
    next(error);
  }
};

export const updateBus: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as BusIdParams;

    const payload = req.body as UpdateBusBody;

    const bus = await busService.updateBus(id, payload);

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
    const query = req.query as unknown as SearchBusesQuery;

    const buses = await busService.searchBuses({
      name: query.name,
      type: query.type,
    });

    res.json({ data: buses });
  } catch (error) {
    next(error);
  }
};
