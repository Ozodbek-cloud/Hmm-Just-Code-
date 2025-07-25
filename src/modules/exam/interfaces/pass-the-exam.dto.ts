import { IsInt, IsArray, ValidateNested, IsString } from "class-validator"
import { Type } from "class-transformer"
import { ExamAnswer } from "@prisma/client"
import { ApiProperty } from "@nestjs/swagger"

class ExamAnswerDto {
  @IsInt()
  id: number

  @IsString()
  answer: string
}

export class PassExamDto {
  @ApiProperty()
  @IsInt()
  lessonGroupId: number

  @ApiProperty(
    {
      type: [ExamAnswerDto],
      description: 'Array of exam questions',
      example: [
        {
          "id": 1,
          "answer": "variantC"
        }
      ],
    })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamAnswerDto)
  answers: ExamAnswerDto[]
}