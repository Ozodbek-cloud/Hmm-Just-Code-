import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsNumber } from 'class-validator';

export class GetHomeworksQueryDto {
  @ApiPropertyOptional({ example: 'clxvfa1e90001tx18d3r4ab5x', description: 'Course ID' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ example: '1', description: 'Page number' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10', description: 'Items per page' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class GetSubmitsQueryDto {
  @ApiPropertyOptional({ example: 'clxvfa1e90001tx18d3r4ab5x', description: 'Course ID' })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({ example: '1', description: 'Page number' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10', description: 'Items per page' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class GetSubmitQueryDto {
  @ApiPropertyOptional({ example: '1', description: 'Page number' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10', description: 'Items per page' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: 'clxvfa1e90001tx18d3r4ab5x', description: 'Course ID' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ example: 1, description: 'Homework ID' })
  @IsOptional()
  @IsNumber()
  homeworkId?: number;

  @ApiPropertyOptional({ example: 1, description: 'User ID' })
  @IsOptional()
  @IsNumber()
  userId?: number;
}