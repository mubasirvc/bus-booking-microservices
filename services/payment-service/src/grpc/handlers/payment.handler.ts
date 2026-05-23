import { paymentService } from '../../services/payment.service.js';

export const paymentHandlers = {
  async CreatePayment(call: any, callback: any) {
    try {
      const { bookingId, userId, amount } = call.request;

      const result = await paymentService.createPayment(bookingId, userId, amount);

      callback(null, result);
    } catch (error) {
      callback(error);
    }
  },
};
