import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports :[JwtModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
