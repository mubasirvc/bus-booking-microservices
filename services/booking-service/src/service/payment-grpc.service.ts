import { paymentClient } from '../grpc/payment.client.js';

class PaymentGrpcService {
  async createPayment(bookingId: string, userId: string, amount: number) {
    return new Promise<{
      paymentId: string;
      orderId: string;
      amount: number;
      status: string;
    }>((resolve, reject) => {
      paymentClient.CreatePayment(
        {
          bookingId,
          userId,
          amount,
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

export default new PaymentGrpcService();
