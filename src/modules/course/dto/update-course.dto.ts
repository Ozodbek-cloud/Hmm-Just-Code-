import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsInt, IsString } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) { }

export class UpdateMentorDto {
    @ApiProperty({ example: 'd23f76bd-9b63-43f0-b2d1-88e9839d263f', description: 'Course ID' })
    @IsString()
    courseId: string;

    @ApiProperty({ example: 42, description: 'Mentor (User) ID' })
    @IsInt()
    userId: number;
}