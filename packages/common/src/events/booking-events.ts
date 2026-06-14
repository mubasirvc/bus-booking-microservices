import { EventPayload, OutboundEvent } from './event-types';

export const BOOKING_EVENTS_EXCHANGE = 'booking.events';
export const BOOKING_CREATED_ROUTING_KEY = 'booking.created';
export const BOOKING_CONFIRMED_ROUTING_KEY = 'booking.confirmed';
export const BOOKING_CANCELLED_ROUTING_KEY = 'booking.cancelled';

export interface BookingCreatedPayload extends EventPayload {
  userId: string;
  bookingId: string;
  busId: string;
  source: string;
  destination: string;
  travelDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  seats: string[];
  totalPrice: number;
}

export interface BookingUpdatedPayload extends EventPayload {
  seats: string[];
  totalPrice: number;
  bookingId: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  busNumber: string;
  busName: string;
  busType: string;
  source: string;
  destination: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export type BookingCreatedEvent = OutboundEvent<
  typeof BOOKING_CREATED_ROUTING_KEY,
  BookingCreatedPayload
>;

export type BookingConfirmedEvent = OutboundEvent<
  typeof BOOKING_CONFIRMED_ROUTING_KEY,
  BookingUpdatedPayload
>;

export type BookingCancelledEvent = OutboundEvent<
  typeof BOOKING_CANCELLED_ROUTING_KEY,
  BookingUpdatedPayload
>;
