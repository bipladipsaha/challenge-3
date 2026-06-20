import nodemailer from 'nodemailer';
import { EmailService, EmailPayload } from './EmailService';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class MailhogService implements EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT, 10),
      ignoreTLS: true,
    });
  }

  async sendEmail(payload: EmailPayload): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: '"CarbonIQ AI" <noreply@carboniq.ai>',
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });

      logger.info(`Email sent to ${payload.to}. MessageId: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error(error, 'Failed to send email via MailHog');
      return false;
    }
  }
}

// Export a singleton instance
export const emailService: EmailService = new MailhogService();
