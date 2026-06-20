export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seats: string[];
  totalAmount: number;
  status: BookingStatus;
  paymentOrderId: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBookingInput = Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'paymentOrderId'>;

export type UpdateBookingInput = Partial<Pick<Booking, 'status' | 'seats' | 'totalAmount' | 'paymentOrderId'>>;

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
}

export interface ReservationDetails {
  bookingId: string;
  userId: string;
  tripId: string;
  seats: string[];
  fare: number;
  busId: string;
  busName: string;
  source: string;
  destination: string;
  travelDate: Date;
}
