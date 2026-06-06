import { tripGrpcService } from '../../modules/trip/service/trip-grpc.services.js';

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
    const { tripId, seatNumbers  } = call.request;

    const result = await tripGrpcService.reserveSeats(tripId, seatNumbers );

    callback(null, result);
  },

  async ReleaseSeats(call: any, callback: any) {
    try {
      const { tripId, seatNumbers  } = call.request;

      const result = await tripGrpcService.releaseSeats(tripId, seatNumbers );

      callback(null, result);
    } catch (error) {
      callback(error);
    }
  },
};
