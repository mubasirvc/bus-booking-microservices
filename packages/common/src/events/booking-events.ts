import { EventPayload, OutboundEvent } from './event-types';

export const BOOKING_EVENTS_EXCHANGE = 'booking.events';
export const BOOKING_PENDING_ROUTING_KEY = 'booking.pending';
export const BOOKING_CONFIRMED_ROUTING_KEY = 'booking.confirmed';
export const BOOKING_CANCELLED_ROUTING_KEY = 'booking.cancelled';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'AWAITING_PAYMENT';

export interface BookingPendingPayload extends EventPayload {
  userId: string;
  bookingId: string;
  status: BookingStatus;
  seats: string[];
  tripId: string;
}

export interface BookingCancelledPayload extends EventPayload, Partial<BookingConfirmedPayload> {}

export interface BookingConfirmedPayload extends EventPayload {
  seats: string[];
  totalPrice: number;
  bookingId: string;
  userId: string;
  tripId: string;
  email: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  busNumber: string;
  busName: string;
  busType: string;
  source: string;
  destination: string;
  reason?: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'AWAITING_PAYMENT';
}

export type BookingPendingEvent = OutboundEvent<
  typeof BOOKING_PENDING_ROUTING_KEY,
  BookingPendingPayload
>;

export type BookingConfirmedEvent = OutboundEvent<
  typeof BOOKING_CONFIRMED_ROUTING_KEY,
  BookingConfirmedPayload
>;

export type BookingCancelledEvent = OutboundEvent<
  typeof BOOKING_CANCELLED_ROUTING_KEY,
  BookingCancelledPayload
>;
