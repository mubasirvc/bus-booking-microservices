import type { AsyncHandler } from '@bus-booking/common';

import { tripService } from '../service/trip.service.js';

import {
  CreateTripBody,
  UpdateTripBody,
  TripIdParams,
  SearchTripsQuery,
} from '../../../validation/trip.schema.js';

/* ---------------------------------- */
/* GET /trips/:id */
/* ---------------------------------- */

export const getTrip: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as TripIdParams;

    const trip = await tripService.getTripById(id);

    res.json({ data: trip });
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------- */
/* GET /trips */
/* ---------------------------------- */

export const getAllTrips: AsyncHandler = async (req, res, next) => {
  try {
    const trips = await tripService.getAllTrips();

    res.json({ data: trips });
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------- */
/* POST /trips */
/* ---------------------------------- */

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

/* ---------------------------------- */
/* PATCH /trips/:id */
/* ---------------------------------- */

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

/* ---------------------------------- */
/* DELETE /trips/:id */
/* ---------------------------------- */

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

/* ---------------------------------- */
/* GET /trips/search */
/* ---------------------------------- */

export const searchTrips: AsyncHandler = async (req, res, next) => {
  try {
    const query = req.query as unknown as SearchTripsQuery;

    const trips = await tripService.searchTrips({
      routeId: query.routeId,
      busId: query.busId,
      travelDate: query.travelDate,
      status: query.status,
    });

    res.json({ data: trips });
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------- */
/* PATCH /trips/:id/cancel */
/* ---------------------------------- */

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
