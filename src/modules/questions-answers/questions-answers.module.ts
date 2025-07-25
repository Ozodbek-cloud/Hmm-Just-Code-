import { Module } from '@nestjs/common';
import { QuestionsAnswersService } from './questions-answers.service';
import { QuestionsAnswersController } from './questions-answers.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,JwtModule],
  controllers: [QuestionsAnswersController],
  providers: [QuestionsAnswersService],
})
export class QuestionsAnswersModule {}
