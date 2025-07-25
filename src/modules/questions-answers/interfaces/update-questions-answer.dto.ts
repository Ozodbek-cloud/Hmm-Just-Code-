import { PartialType } from '@nestjs/swagger';
import { CreateQuestionAnswerDto, CreateQuestionsDto } from './create-questions-answer.dto';

export class UpdateQuestionsDto extends PartialType(CreateQuestionsDto) {}

export class UpdateQuestionsAnswerDto extends PartialType(CreateQuestionAnswerDto) {}
