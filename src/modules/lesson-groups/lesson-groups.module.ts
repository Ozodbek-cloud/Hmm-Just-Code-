import { Module } from '@nestjs/common';
import { LessonGroupsService } from './lesson-groups.service';
import { LessonGroupsController } from './lesson-groups.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [LessonGroupsController],
  providers: [LessonGroupsService],
})
export class LessonGroupsModule {}
