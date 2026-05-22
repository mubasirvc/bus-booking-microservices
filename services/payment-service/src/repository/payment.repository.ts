import { Payment } from '../types/payment.js';
import { PaymentModel } from '../db/index.js';
import { CreatePaymentInput } from '../types/payment.js';

const toDomainPayment = (model: PaymentModel): Payment => ({
  id: model.id,
  bookingId: model.bookingId,
  userId: model.userId,
  amount: Number(model.amount),
  currency: model.currency,
  razorpayOrderId: model.razorpayOrderId,
  razorpayPaymentId: model.razorpayPaymentId,
  status: model.status,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class PaymentRepository {
  async create(data: CreatePaymentInput): Promise<Payment> {
    const payment = await PaymentModel.create(data);

    return toDomainPayment(payment);
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await PaymentModel.findByPk(id);

    return payment ? toDomainPayment(payment) : null;
  }

  async findByOrderId(razorpayOrderId: string): Promise<Payment | null> {
    const payment = await PaymentModel.findOne({
      where: {
        razorpayOrderId,
      },
    });

    return payment ? toDomainPayment(payment) : null;
  }

  async updateStatus(
    id: string,
    status: 'PENDING' | 'SUCCESS' | 'FAILED',
    razorpayPaymentId?: string,
  ): Promise<Payment | null> {
    const payment = await PaymentModel.findByPk(id);

    if (!payment) {
      return null;
    }

    await payment.update({
      status,
      razorpayPaymentId,
    });

    return toDomainPayment(payment);
  }
}

export const paymentRepository = new PaymentRepository();
