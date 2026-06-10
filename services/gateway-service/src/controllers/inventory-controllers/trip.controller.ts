import { AsyncHandler } from '@bus-booking/common';
import {tripProxyService} from '../../services/inventor-services/trip-proxy.service'

import {
  createTripSchema,
  listTripsQuerySchema,
  searchTripsQuerySchema,
  tripIdParamsSchema,
  updateTripSchema,
} from '../../validation/trip.schema.js';
import { getAuthenticatedUser } from '../../utils/auth';

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
    const query = listTripsQuerySchema.parse(req.query);
    const response = await tripProxyService.getAllTrips(query);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createTrip: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const payload = createTripSchema.parse(req.body);
    const response = await tripProxyService.createTrip(user, payload);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateTrip: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = tripIdParamsSchema.parse(req.params);
    const payload = updateTripSchema.parse(req.body);
    const response = await tripProxyService.updateTrip(user, id, payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = tripIdParamsSchema.parse(req.params);
    const response = await tripProxyService.deleteTrip(user, id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const cancelTrip: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = tripIdParamsSchema.parse(req.params);
    const response = await tripProxyService.cancelTrip(user, id);
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
