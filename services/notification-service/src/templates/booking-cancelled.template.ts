import { BookingNotificationPayload } from "../types/index.js";

export const bookingCancelledTemplate = (
  booking: BookingNotificationPayload,
) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
    
    <div style="max-width:600px;margin:auto;background:#fff;padding:24px;border-radius:12px;">
      
      <h2 style="color:#dc2626;">
        ❌ Booking Cancelled
      </h2>

      <p>
        Your booking has been cancelled.
      </p>

      <hr />

      <h3>Trip Details</h3>

      <p><strong>Bus:</strong> ${booking.busName}</p>
      <p><strong>Bus Number:</strong> ${booking.busNumber}</p>
      <p><strong>Route:</strong> ${booking.source} → ${booking.destination}</p>
      <p><strong>Travel Date:</strong> ${booking.travelDate}</p>

      <p><strong>Booking ID:</strong> ${booking.bookingId}</p>

    </div>

  </body>
  </html>
  `;
};