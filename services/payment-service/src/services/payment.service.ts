import { HttpError } from '@bus-booking/common';
import { razorpay } from '../config/razorpay.js';
import { paymentRepository, PaymentRepository } from '../repository/payment.repository.js';
import { logger } from '../utils/logger.js';
import bookingGrpcService from './booking.grpc.service.js';
import { publishPaymentFailed, publishPaymentSuccess } from '../messaging/event-publishing.js';

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
    
    const payment = await this.respository.findByOrderId(orderId);

    if (!payment) {
      throw new HttpError(404, 'Payment not found');
    }

    if (event === 'payment.captured') {
      await this.respository.updateStatus(payment.id, 'SUCCESS', razorpayPaymentId);

      logger.info('Payment marked SUCCESS' + payment, );
      //publish booking confirmed event for other services now for user service to update booking history

      publishPaymentSuccess({
        bookingId: payment.bookingId,
        userId: payment.userId,
        status: 'CONFIRMED',
      });

      // await bookingGrpcService.updateBookingStatus(payment.bookingId, 'CONFIRMED');
    }

    if (event === 'payment.failed') {
      await this.respository.updateStatus(payment.id, 'FAILED');

      logger.info('Payment marked FAILED');
      //publish booking cancelled event for other services now for user service to update booking history

      publishPaymentFailed({
        bookingId: payment.bookingId,
        userId: payment.userId,
        status: 'CANCELLED',
      });

      //await bookingGrpcService.updateBookingStatus(payment.bookingId, 'CANCELLED');
    }
  }

  async createPayment(bookingId: string, userId: string, amount: number) {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: bookingId,
    });

    const payment = await paymentRepository.create({
      bookingId,
      userId,
      amount,
      razorpayOrderId: order.id,
      currency: 'INR',
      status: 'PENDING',
    });

    return {
      paymentId: payment.id,
      orderId: order.id,
      amount: payment.amount,
      status: payment.status,
    };
  }
}

export const paymentService = new PaymentService(paymentRepository);
