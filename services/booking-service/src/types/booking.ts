export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seats: string[];
  totalAmount: number;
  status?: 'PENDING' | 'CANCELLED' | 'CONFIRMED';
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBookingInput = Omit<
  Booking,
  'id'| 'createdAt' | 'updatedAt'
>;

export type UpdateBookingInput = Partial<
  Pick<Booking, 'status'>
>;

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}