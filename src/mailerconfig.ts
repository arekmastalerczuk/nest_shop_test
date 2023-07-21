import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { mailConfig } from './config/mail-config';

const {
host, user, pass, from,
} = mailConfig;

export = {
  transport: {
    host,
    port: 465,
    ignoreTLS: false,
    secure: true,
    auth: {
      user,
      pass,
    },
  },
  defaults: {
    from,
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
