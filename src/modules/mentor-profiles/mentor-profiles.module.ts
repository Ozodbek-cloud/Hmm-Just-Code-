import { Module } from '@nestjs/common';
import { MentorProfilesService } from './mentor-profiles.service';
import { MentorProfilesController } from './mentor-profiles.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [JwtModule, PrismaModule],
  providers: [MentorProfilesService],
  controllers: [MentorProfilesController]
})
export class MentorProfilesModule {}
