import { deprecate } from 'node:util';
import { tripGrpcService } from '../../modules/trip/service/trip-grpc.services.js';
import { tripService } from '../../modules/trip/service/trip.service.js';

export const inventoryHandlers = {
  async GetAvailableSeats(call: any, callback: any) {
    try {
      const { tripId } = call.request;

      const availableSeats = await tripGrpcService.checkSeatAvailability(tripId);

      callback(null, {
        availableSeats,
      });
    } catch (error) {
      callback(error);
    }
  },

  async ReserveSeats(call: any, callback: any) {
    const { tripId, seatNumbers } = call.request;

    const result = await tripGrpcService.reserveSeats(tripId, seatNumbers);

    callback(null, result);
  },

  async ReleaseSeats(call: any, callback: any) {
    try {
      const { tripId, seatNumbers } = call.request;

      const result = await tripGrpcService.releaseSeats(tripId, seatNumbers);

      callback(null, result);
    } catch (error) {
      callback(error);
    }
  },

  async GetTripDetails(call: any, callback: any) {
    try {
      const { tripId } = call.request;

      const trip = await tripService.getTripDetails(tripId);

      const data = {
        tripId: trip.tripId,
        travelDate: trip.travelDate,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        busId: trip.busId,
        busNumber: trip.busNumber,
        busName: trip.busName,
        busType: trip.busType,
        source: trip.source,
        destination: trip.destination,
      };

      callback(null, data);
    } catch (error) {
      callback(error);
    }
  },
};
