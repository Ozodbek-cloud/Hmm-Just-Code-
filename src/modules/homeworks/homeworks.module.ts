import { Module } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { HomeworksController } from './homeworks.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [HomeworksController],
  providers: [HomeworksService],
})
export class HomeworksModule {}
