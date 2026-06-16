import type { AsyncHandler } from '@bus-booking/common';

import { tripService } from '../service/trip.service.js';

import {
  CreateTripBody,
  UpdateTripBody,
  TripIdParams,
  SearchTripsQuery,
} from '../../../validation/trip.schema.js';


export const getTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as TripIdParams;

    const trip = await tripService.getTripById(id);

    res.json({ data: trip });
  } catch (error) {
    next(error);
  }
};


export const getAllTrips: AsyncHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const trips = await tripService.getAllTrips(page, limit);

    res.json({ data: trips });
  } catch (error) {
    next(error);
  }
};


export const createTrip: AsyncHandler = async (req, res, next) => {
  try {
    const payload = req.body as CreateTripBody;

    const trip = await tripService.createTrip(payload);

    res.status(201).json({
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};


export const updateTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as TripIdParams;

    const payload = req.body as UpdateTripBody;

    const trip = await tripService.updateTrip(id, payload);

    res.json({ data: trip });
  } catch (error) {
    next(error);
  }
};


export const deleteTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as TripIdParams;

    await tripService.deleteTrip(id);

    res.json({
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


export const searchTrips: AsyncHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { routeId, busId, travelDate, status} = req.query as unknown as SearchTripsQuery;

    const trips = await tripService.searchTrips({
      routeId,
      busId,
      travelDate,
      status,
      page,limit
    });

    res.json({ data: trips });
  } catch (error) {
    next(error);
  }
};


export const cancelTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as TripIdParams;

    await tripService.cancelTrip(id);

    res.json({
      message: 'Trip cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
