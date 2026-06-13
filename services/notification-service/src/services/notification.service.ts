import { env } from '../config/env.js';
import { resend } from '../providers/resend.provider.js';
import { verifyEmailTemplate } from '../templates/verify-email.template.js';
import { SendVerificationEmailInput } from '../types/index.js';

class NotificationService {
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
}

export const notificationService = new NotificationService();
