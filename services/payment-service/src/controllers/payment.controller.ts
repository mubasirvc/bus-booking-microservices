import { AsyncHandler } from '@bus-booking/common';
import { paymentService } from '../services/payment.service.js';
import { CreatePaymentBody } from '../validation/paymet.schema.js';

export const createPayment: AsyncHandler = async (req, res) => {
  const { bookingId, userId, amount } = req.body as CreatePaymentBody;

  const { payment, order } = await paymentService.createOrder(bookingId, userId, amount);

  res.status(201).json({
    data: {
      payment,
      order,
    },
  });
};

export const paymentWebhook: AsyncHandler = async (req, res) => {
  await paymentService.handleWebhook(req.body);

  res.status(200).json({
    success: true,
  });
};
