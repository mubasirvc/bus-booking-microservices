import { EventPayload, OutboundEvent } from './event-types';

export const BOOKING_EVENTS_EXCHANGE = 'booking.events';
export const BOOKING_CREATED_ROUTING_KEY = 'booking.created';
export const BOOKING_UPDATED_ROUTING_KEY = 'booking.updated';

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
  bookingId: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export type BookingCreatedEvent = OutboundEvent<
  typeof BOOKING_CREATED_ROUTING_KEY,
  BookingCreatedPayload
>;

export type BookingUpdatedEvent = OutboundEvent<
  typeof BOOKING_UPDATED_ROUTING_KEY,
  BookingUpdatedPayload
>;
