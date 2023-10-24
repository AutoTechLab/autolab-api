import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailData } from '../data/SendEmailData';

@Injectable()
export class EmailService {
  constructor (
    private readonly mailerService: MailerService,
  ) {}

  async sendMail ({ to, subject, text }: SendEmailData) {
    await this.mailerService.sendMail({ to, subject, text });
  }
}