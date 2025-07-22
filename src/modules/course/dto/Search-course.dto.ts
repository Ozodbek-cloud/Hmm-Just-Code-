import { ApiPropertyOptional } from "@nestjs/swagger";
import { CourseLevel } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";

export class GetCoursesDto {
  @ApiPropertyOptional({ example: '0', description: 'Offset for pagination (e.g., 0, 10, 20...)' })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiPropertyOptional({ example: '8', description: 'Limit for pagination (number of items per page)' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: 'javascript', description: 'Search keyword for title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CourseLevel, example: 'INTERMEDIATE', description: 'Course level filter' })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({ example: '1', description: 'Category ID for filtering' })
  @IsOptional()
  @IsNumberString()
  categoryId?: string;

  @ApiPropertyOptional({ example: '5', description: 'Mentor ID for filtering' })
  @IsOptional()
  @IsNumberString()
  mentorId?: string;

  @ApiPropertyOptional({ example: '0', description: 'Minimum course price' })
  @IsOptional()
  @IsNumberString()
  price_min?: string;

  @ApiPropertyOptional({ example: '100', description: 'Maximum course price' })
  @IsOptional()
  @IsNumberString()
  price_max?: string;

}

export class GetOtherCoursesDto {
  @ApiPropertyOptional({ example: '0', description: 'Offset for pagination (e.g., 0, 10, 20...)' })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiPropertyOptional({ example: '8', description: 'Limit for pagination (number of items per page)' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: 'javascript', description: 'Search keyword for title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CourseLevel, example: 'INTERMEDIATE', description: 'Course level filter' })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({ example: '1', description: 'Category ID for filtering' })
  @IsOptional()
  @IsNumberString()
  categoryId?: string;

  @ApiPropertyOptional({ example: '5', description: 'Mentor ID for filtering' })
  @IsOptional()
  @IsNumberString()
  mentorId?: string;

  @ApiPropertyOptional({ example: '0', description: 'Minimum course price' })
  @IsOptional()
  @IsNumberString()
  price_min?: string;

  @ApiPropertyOptional({ example: '100', description: 'Maximum course price' })
  @IsOptional()
  @IsNumberString()
  price_max?: string;

  @ApiPropertyOptional({ example: false, description: 'Filter courses by published status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  published?: boolean;
}

export class GetOtherMentorDto {

  @ApiPropertyOptional({ example: '5', description: 'Mentor ID for filtering' })
  @IsOptional()
  @IsNumberString()
  id?: string;

  @ApiPropertyOptional({ example: '0', description: 'Offset for pagination (e.g., 0, 10, 20...)' })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiPropertyOptional({ example: '8', description: 'Limit for pagination (number of items per page)' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: 'javascript', description: 'Search keyword for title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CourseLevel, example: 'INTERMEDIATE', description: 'Course level filter' })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({ example: '1', description: 'Category ID for filtering' })
  @IsOptional()
  @IsNumberString()
  categoryId?: string;

  @ApiPropertyOptional({ example: '0', description: 'Minimum course price' })
  @IsOptional()
  @IsNumberString()
  price_min?: string;

  @ApiPropertyOptional({ example: '100', description: 'Maximum course price' })
  @IsOptional()
  @IsNumberString()
  price_max?: string;

  @ApiPropertyOptional({ example: false, description: 'Filter courses by published status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  published?: boolean;
}