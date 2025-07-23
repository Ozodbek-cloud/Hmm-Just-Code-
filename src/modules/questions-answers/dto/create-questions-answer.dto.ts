import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateQuestionsDto {
    @ApiProperty({ example: 'Yangi question', description: 'Questions' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ example: 'file.pdf', description: 'Fayl nomi', required: false, format: "binary" })
    @IsString()
    @IsOptional()
    file?: string;
}

export class CreateQuestionAnswerDto {
    @ApiProperty({ example: 'Yangi question', description: 'Questions' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ example: 'file.pdf', description: 'Fayl nomi', required: false, format: "binary" })
    @IsString()
    @IsOptional()
    file?: string;
}