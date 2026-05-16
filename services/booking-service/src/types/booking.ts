export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seatCount: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBookingInput = Omit<
  Booking,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export type UpdateBookingInput = Partial<
  Pick<Booking, 'status'>
>;