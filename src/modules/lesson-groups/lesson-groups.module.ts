import { Module } from '@nestjs/common';
import { LessonGroupsService } from './lesson-groups.service';
import { LessonGroupsController } from './lesson-groups.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [LessonGroupsController],
  providers: [LessonGroupsService],
})
export class LessonGroupsModule {}
