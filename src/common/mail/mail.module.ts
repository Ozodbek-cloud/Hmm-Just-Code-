import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
@Module({
  imports: [
    NestMailerModule.forRoot({
      transport:{
        service: "gmail",
        auth: {
          user:'vortextblade16@gmail.com',
           pass:'xnacspfcrkjgifbc'
        }
      },
      defaults:{
        from: 'The_Lord_Coder'
      },
      template:{
        dir: join(process.cwd(), 'src', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
