import { Module } from '@nestjs/common';
import { LessonFileService } from './lesson-file.service';
import { LessonFileController } from './lesson-file.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [LessonFileController],
  providers: [LessonFileService],
})
export class LessonFileModule {}
