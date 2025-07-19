import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateLessonGroupDto {
    @ApiProperty({ example: 'Frontend Darslari', description: 'LessonGroup nomi' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'abc123-course-id', description: 'Bog‘liq course ID' })
    @IsNotEmpty()
    @IsString()
    courseId: string;
}



