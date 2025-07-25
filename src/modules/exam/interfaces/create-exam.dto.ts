import { ApiProperty } from '@nestjs/swagger';
import { ExamAnswer } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

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

export class CreateExamManyDto {
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
}
export class CreateManyExamsDto {
    @ApiProperty({ example: 1, description: 'ID of the related lesson group' })
    @IsInt()
    @Type(() => Number)
    lessonGroupId: number

    @ApiProperty(
        {
            type: [CreateExamDto],
            description: 'Array of exam questions',
            example: [
                {
                    question: 'What does DOM mean in JavaScript?',
                    variantA: 'Direct Object Module',
                    variantB: 'Document Object Model',
                    variantC: 'Document Object Model',
                    variantD: 'Document Object Module',
                    answer: 'variantC',
                },
            ],
        })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateExamManyDto)
    exams: CreateExamManyDto[]
}

