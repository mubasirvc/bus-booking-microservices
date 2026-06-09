import { AsyncHandler } from '@bus-booking/common';
import {tripProxyService} from '../../services/inventor-services/trip-proxy.service'

import {
  createTripSchema,
  searchTripsQuerySchema,
  tripIdParamsSchema,
  updateTripSchema,
} from '../../validation/trip.schema.js';

export const getTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = tripIdParamsSchema.parse(req.params);
    const response = await tripProxyService.getTripById(id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllTrips: AsyncHandler = async (req, res, next) => {
  try {
    const response = await tripProxyService.getAllTrips();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createTrip: AsyncHandler = async (req, res, next) => {
  try {
    const payload = createTripSchema.parse(req.body);
    const response = await tripProxyService.createTrip(payload);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = tripIdParamsSchema.parse(req.params);
    const payload = updateTripSchema.parse(req.body);
    const response = await tripProxyService.updateTrip(id, payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = tripIdParamsSchema.parse(req.params);
    const response = await tripProxyService.deleteTrip(id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const cancelTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = tripIdParamsSchema.parse(req.params);
    const response = await tripProxyService.cancelTrip(id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const searchTrips: AsyncHandler = async (req, res, next) => {
  try {
    const query = searchTripsQuerySchema.parse(req.query);
    const response = await tripProxyService.searchTrips(query);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
