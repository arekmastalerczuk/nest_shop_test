import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import mailerconfig = require('../mailerconfig')

@Module({
  imports: [MailerModule.forRoot(mailerconfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
