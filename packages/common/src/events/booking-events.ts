import { EventPayload, OutboundEvent } from './event-types';

export const BOOKING_EVENTS_EXCHANGE = 'booking.events';
export const BOOKING_CREATED_ROUTING_KEY = 'booking.created';

export interface BookingCreatedPayload extends EventPayload {
  userId: string;
  bookingId: string;
  busId: string;
  source: string;
  destination: string;
  travelDate: string;
  status: string;
  seats: string[];
  totalPrice: number;
}

export type BookingCreatedEvent = OutboundEvent<
  typeof BOOKING_CREATED_ROUTING_KEY,
  BookingCreatedPayload
>;
