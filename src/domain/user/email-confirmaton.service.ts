import { Injectable } from '@nestjs/common';
import EmailService from 'src/providers/email.service';

@Injectable()
export class EmailConfirmationService {
  constructor(private readonly emailService: EmailService) {}

  public sendVerificationLink(email: string, otp) {
    // const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text: `OTP code \n ${otp}`,
    });
  }
}
