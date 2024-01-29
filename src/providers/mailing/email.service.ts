import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailingService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(recipient_mails: string[], otp: string) {
    this.mailerService
      .sendMail({
        to: recipient_mails, // list of receivers
        from: process.env.EMAIL_USER, // sender address
        subject: 'IJRO xati', // Subject line
        template: './email.hbs',
        context: {
          otp,
        },
        text: otp,
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });

    return { success: true };
  }
}
