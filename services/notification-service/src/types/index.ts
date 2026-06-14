export type SendVerificationEmailInput = {
  email: string;
  userName?: string;
  verificationToken: string;
};


export interface BookingNotificationPayload  {
  seats: string[];
  totalPrice: number;
  email: string;
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