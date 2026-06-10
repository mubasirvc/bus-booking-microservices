import { AsyncHandler } from '@bus-booking/common';

import { paymentProxyService } from '../services/payment-proxy.service';
import { getAuthenticatedUser } from '../utils/auth';

export const createPayment: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const response = await paymentProxyService.createOrder(user, req.body);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const paymentWebhook: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const response = await paymentProxyService.webhook(user, req.body);

    res.json(response);
  } catch (error) {
    next(error);
  }
};
