import { EventPayload, OutboundEvent } from "./event-types";

export const INVENTORY_EVENTS_EXCHANGE = 'inventory-events';
export const SEAT_RESERVATION_FAILED_ROUTING_KEY = 'seat.reservation.failed';
export const SEAT_RESERVATION_SUCCESS_ROUTING_KEY = 'seat.reservation.success';


export interface SeatReservationFailedPayload extends EventPayload {
  bookingId: string;
  userId: string;
  tripId: string;
  seats: string[];
  reason: string;
}
  
export interface SeatReservationSuccessPayload extends EventPayload {
  bookingId: string;
  userId: string;
  tripId: string;
  seats: string[];
  fare: number;
  remainingSeats: number;
  busId: string;
  busName: string;
  source: string;
  destination: string;
  travelDate: string;
}

export type SeatReservationFailedEvent = OutboundEvent<
  typeof SEAT_RESERVATION_FAILED_ROUTING_KEY,
  SeatReservationFailedPayload
>;

export type SeatReservationSuccessEvent = OutboundEvent<
  typeof SEAT_RESERVATION_SUCCESS_ROUTING_KEY,
  SeatReservationSuccessPayload
>; 