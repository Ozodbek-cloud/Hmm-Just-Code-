import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignedCourseDto {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID raqami (Int)' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 'abc123-course-id', description: 'Kurs IDsi (String)' })
  @IsString()
  courseId: string;
}
