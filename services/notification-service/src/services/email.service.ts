import { env } from '../config/env.js';
import { resend } from '../providers/resend.provider.js';
import { bookingCancelledTemplate } from '../templates/booking-cancelled.template.js';
import { bookingConfirmedTemplate } from '../templates/booking-confirmed.template.js';
import { verifyEmailTemplate } from '../templates/verify-email.template.js';
import { BookingNotificationPayload, SendVerificationEmailInput } from '../types/index.js';
import { logger } from '../utils/logger.js';

class EmailService {
  async sendVerificationEmail({
    email,
    userName,
    verificationToken,
  }: SendVerificationEmailInput): Promise<void> {
    //from frontend
    const verificationLink = `${env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    //direct api
    // const verificationLink = `${env.API_URL}/auth/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email',
      html: verifyEmailTemplate({
        name: userName,
        verificationUrl: verificationLink,
      }),
    });
  }

  async sendBookingConfirmation(payload: BookingNotificationPayload): Promise<void> {
    logger.info(`Sending booking confirmation email to ${payload.email} for booking ID ${payload.bookingId}`);
    
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: payload.email,
      subject: 'Booking Confirmed',
      html: bookingConfirmedTemplate(payload),
    });
  }

  async sendBookingCancellation(payload: BookingNotificationPayload): Promise<void> {
    logger.info(`Sending booking cancellation email to ${payload.email} for booking ID ${payload.bookingId}`);
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: payload.email,
      subject: 'Booking Cancelled',
      html: bookingCancelledTemplate(payload),
    });
  }
}

export const emailService = new EmailService();
