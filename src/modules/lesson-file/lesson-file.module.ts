import { Module } from '@nestjs/common';
import { LessonFileService } from './lesson-file.service';
import { LessonFileController } from './lesson-file.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LessonFileController],
  providers: [LessonFileService],
})
export class LessonFileModule {}
