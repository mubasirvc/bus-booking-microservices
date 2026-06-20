import { inventoryClient } from '../grpc/inventory.client.js';

type ReserveSeatsResponse = {
  success: boolean;
};

// type ReserveSeatsResponse = {
//   success: boolean;
//   remainingSeats: number;
//   fare: number;
//   busName: string;
//   busId: string;
//   source: string;
//   destination: string;
//   travelDate: string;
// };

export type TripDetails = {
  tripId: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  busId: string;
  busNumber: string;
  busName: string;
  busType: string;
  source: string;
  destination: string;
};

class InventoryGrpcService {
  async getAvailableSeats(tripId: string) {
    return new Promise<number>((resolve, reject) => {
      inventoryClient.GetAvailableSeats(
        { tripId },

        (err: any, response: any) => {
          if (err) {
            return reject(err);
          }

          resolve(response.availableSeats);
        },
      );
    });
  }

  async getTripDetails(tripId: string) {
    return new Promise<TripDetails>((resolve, reject) => {
      inventoryClient.GetTripDetails(
        { tripId },

        (err: any, response: TripDetails) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        },
      );
    });
  }

  async reserveSeats(tripId: string, seatNumbers: string[]): Promise<ReserveSeatsResponse> {
    return new Promise<ReserveSeatsResponse>((resolve, reject) => {
      inventoryClient.ReserveSeats(
        {
          tripId,
          seatNumbers,
        },
        (err: any, response: ReserveSeatsResponse) => {
          if (err) {
            return reject(err);
          }

          resolve(response);
        },
      );
    });
  }
  // async reserveSeats(tripId: string, seatNumbers: string[]): Promise<ReserveSeatsResponse> {
  //   return new Promise<ReserveSeatsResponse>((resolve, reject) => {
  //     inventoryClient.ReserveSeats(
  //       {
  //         tripId,
  //         seatNumbers,
  //       },
  //       (err: any, response: ReserveSeatsResponse) => {
  //         if (err) {
  //           return reject(err);
  //         }

  //         resolve(response);
  //       },
  //     );
  //   });
  // }

  async releaseSeats(tripId: string, seatNumbers: string[]): Promise<{ success: boolean }> {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      inventoryClient.ReleaseSeats(
        {
          tripId,
          seatNumbers,
        },
        (err: any, response: { success: boolean }) => {
          if (err) {
            return reject(err);
          }

          resolve(response);
        },
      );
    });
  }
}

export default new InventoryGrpcService();
