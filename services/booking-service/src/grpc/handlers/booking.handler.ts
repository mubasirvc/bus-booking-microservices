import { bookingService } from '../../service/booking.service.js';

export const bookingHandlers = {
  async UpdateBookingStatus(call: any, callback: any) {
    try {
      const { bookingId, status } = call.request;

      await bookingService.updateBookingStatus(bookingId, status);

      callback(null, {
        success: true,
      });
    } catch (error) {
      callback(error);
    }
  },
};
