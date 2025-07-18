import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLastActivityDto {
  @ApiPropertyOptional({
    description: 'Kurs IDsi (agar mavjud bo‘lsa)',
    example: 'abc123',
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    description: 'Guruh IDsi (agar mavjud bo‘lsa)',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  groupId?: number;

  @ApiPropertyOptional({
    description: 'Dars IDsi (agar mavjud bo‘lsa)',
    example: 'lesson_001',
  })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({
    description: 'So‘nggi tashrif qilingan URL',
    example: '/course/abc123/lesson/001',
  })
  @IsOptional()
  @IsString()
  url?: string;
}
