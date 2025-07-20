import { IsInt, IsArray, ValidateNested, IsString } from "class-validator"
import { Type } from "class-transformer"
import { ExamAnswer } from "@prisma/client"

class ExamAnswerDto {
  @IsInt()
  id: number

  @IsString()
  answer: string
}

export class PassExamDto {
  @IsInt()
  lessonGroupId: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamAnswerDto)
  answers: ExamAnswerDto[]
}