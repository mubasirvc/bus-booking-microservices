import { AsyncHandler } from '@bus-booking/common';

import { paymentProxyService } from '../services/payment-proxy.service';

export const createPayment: AsyncHandler = async (req, res, next) => {
  try {
    const response = await paymentProxyService.createOrder(req.body);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const paymentWebhook: AsyncHandler = async (req, res, next) => {
  try {
    const response = await paymentProxyService.webhook(req.body);

    res.json(response);
  } catch (error) {
    next(error);
  }
};
