import { ApiProperty } from '@nestjs/swagger';
import { ExamAnswer } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamDto {
    @ApiProperty({ example: 'What is 2 + 2?', description: 'The question text' })
    @IsString()
    @IsNotEmpty()
    question: string;

    @ApiProperty({ example: '3', description: 'Variant A' })
    @IsString()
    @IsNotEmpty()
    variantA: string;

    @ApiProperty({ example: '4', description: 'Variant B' })
    @IsString()
    @IsNotEmpty()
    variantB: string;

    @ApiProperty({ example: '5', description: 'Variant C' })
    @IsString()
    @IsNotEmpty()
    variantC: string;

    @ApiProperty({ example: '6', description: 'Variant D' })
    @IsString()
    @IsNotEmpty()
    variantD: string;

    @ApiProperty({ enum: ExamAnswer, example: ExamAnswer.variantB, description: 'Correct answer (A/B/C/D)' })
    @IsEnum(ExamAnswer)
    answer: ExamAnswer;

    @ApiProperty({ example: 1, description: 'ID of the related lesson group' })
    @IsInt()
    lessonGroupId: number;
}
export class CreateManyExamsDto {
    @ApiProperty({ example: 1, description: 'ID of the related lesson group' })
    @IsInt()
    lessonGroupId: number
    
    @ApiProperty()
    @IsNotEmpty()
    exams: CreateExamDto[]
}
 
