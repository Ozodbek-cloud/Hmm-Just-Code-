import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { SmsService } from 'src/common/services/services.service';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [VerificationService, SmsService],
  controllers: [VerificationController],
  exports: [VerificationService]
})
export class VerificationModule {}
