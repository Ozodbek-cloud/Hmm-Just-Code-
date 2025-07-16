import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [JwtModule, MailModule, RedisModule]
})

export class ConfigModule {}
