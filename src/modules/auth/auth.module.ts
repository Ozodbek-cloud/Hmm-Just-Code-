import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [JwtModule, PrismaModule, RedisModule, VerificationModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
