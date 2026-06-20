export interface User {
    id: string;
    email: string;
    userName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserInput {
    email: string;
    userName: string;
}


export interface MyBookingPayload {
  bookingId: string;
  userId: string;
  tripId: string;
  seats: string[];
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAYMENT_AWAIT';
  totalPrice?: number;
  busId?: string;
  busName?: string;
  source?: string;
  destination?: string;
  travelDate?: string;
} 