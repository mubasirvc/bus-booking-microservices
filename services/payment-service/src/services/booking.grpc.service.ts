import { bookingClient } from '../grpc/booking.client.js';

class BookingGrpcService {
  async updateBookingStatus(bookingId: string, status: string) {
    return new Promise((resolve, reject) => {
      bookingClient.UpdateBookingStatus(
        {
          bookingId,
          status,
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
}

export default new BookingGrpcService();
