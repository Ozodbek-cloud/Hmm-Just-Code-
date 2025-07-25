import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [ConfigModule],
})
export class AppModule {}


