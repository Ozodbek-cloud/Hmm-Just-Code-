import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { VerificationService } from '../verification/verification.service';
import { VerificationModule } from '../verification/verification.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { ProfileService } from './profile.service';
import { profilesController } from './profile.controller';

@Module({
  imports :[JwtModule, PrismaModule, VerificationModule, RedisModule],
  controllers: [profilesController],
  providers: [ProfileService]
})
export class ProfilesModule {}
