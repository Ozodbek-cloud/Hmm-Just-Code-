import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { VerificationModule } from './modules/verification/verification.module';


@Module({
  imports: [ConfigModule, VerificationModule],
})
export class AppModule {}
