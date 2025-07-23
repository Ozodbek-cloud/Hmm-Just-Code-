import { Module } from '@nestjs/common';
import { QuestionsAnswersService } from './questions-answers.service';
import { QuestionsAnswersController } from './questions-answers.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionsAnswersController],
  providers: [QuestionsAnswersService],
})
export class QuestionsAnswersModule {}
