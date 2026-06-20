import { EventPayload, OutboundEvent } from './event-types';

export const PAYMENT_EVENTS_EXCHANGE = 'payment.events';
export const PAYMENT_SUCCESS_ROUTING_KEY = 'payment.success';
export const PAYMENT_FAILED_ROUTING_KEY = 'payment.failed';

export interface PaymentRsultPayload extends EventPayload {
  bookingId: string;
  userId?: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export type PaymentSuccessEvent = OutboundEvent<
  typeof PAYMENT_SUCCESS_ROUTING_KEY,
  PaymentRsultPayload
>;
export type PaymentFailedEvent = OutboundEvent<
  typeof PAYMENT_FAILED_ROUTING_KEY,
  PaymentRsultPayload
>;

