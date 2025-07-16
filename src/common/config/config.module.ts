import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MentorProfilesModule } from 'src/modules/mentor-profiles/mentor-profiles.module';

@Module({
    imports: [JwtModule, MailModule, RedisModule, PrismaModule, AuthModule, MentorProfilesModule]
})

export class ConfigModule {}
