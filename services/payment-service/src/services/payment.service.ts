import { HttpError } from '@bus-booking/common';
import { razorpay } from '../config/razorpay.js';
import { paymentRepository, PaymentRepository } from '../repository/payment.repository.js';
import { logger } from '../utils/logger.js';

class PaymentService {
  constructor(private respository: PaymentRepository) {}

  async createOrder(bookingId: string, userId: string, amount: number) {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: bookingId,
    };

    const order = await razorpay.orders.create(options);

    const payment = await this.respository.create({
      bookingId,
      userId,
      amount,
      currency: 'INR',
      razorpayOrderId: order.id,
      status: 'PENDING',
    });

    return {
      payment,
      order,
    };
  }

  async handleWebhook(data: any): Promise<void> {
    const { event, payload } = data;

    const paymentEntity = payload.payment.entity;

    const orderId = paymentEntity.order_id;

    const razorpayPaymentId = paymentEntity.id;
    logger.info(`Received webhook for orderId: ${orderId} with event: ${event}`);

    const payment = await this.respository.findByOrderId(orderId);

    if (!payment) {
      throw new HttpError(404, 'Payment not found');
    }

    if (event === 'payment.captured') {
      await this.respository.updateStatus(payment.id, 'SUCCESS', razorpayPaymentId);

      logger.info('Payment marked SUCCESS');

      // await bookingClient.updateBookingStatus(payment.bookingId, 'CONFIRMED');
    }

    if (event === 'payment.failed') {
      await this.respository.updateStatus(payment.id, 'FAILED');

      logger.info('Payment marked FAILED');

      // await bookingClient.updateBookingStatus(payment.bookingId, 'CANCELLED');
    }
  }
}

export const paymentService = new PaymentService(paymentRepository);
