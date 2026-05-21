import { inventoryClient } from '../grpc/inventory.client.js';

type ReserveSeatsResponse = {
  success: boolean;
  remainingSeats: number;
  fare: number;
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

  async reserveSeats(tripId: string, seatCount: number) {
    return new Promise<ReserveSeatsResponse>((resolve, reject) => {
      inventoryClient.ReserveSeats(
        {
          tripId,
          seatCount,
        },
        (err: any, response: any) => {
          if (err) {
            return reject(err);
          }

          resolve(response);
        },
      );
    });
  }

  async releaseSeats(tripId: string, seatCount: number): Promise<{ success: boolean }> {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      inventoryClient.ReleaseSeats(
        {
          tripId,
          seatCount,
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
