import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class GetPurchasedQueryDto {
    @ApiPropertyOptional({ example: 0, description: 'Offset qiymati' })
    @IsOptional()
    @IsNumber()
    offset?: number;

    @ApiPropertyOptional({ example: 10, description: 'Limit qiymati' })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ example: 'nodejs', description: 'Qidirilayotgan matn' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: 3, description: 'Category ID' })
    @IsOptional()
    @IsNumber()
    categoryId?: number;

    @ApiPropertyOptional({ example: CourseLevel.BEGINNER, description: 'Daraja (level)', enum: CourseLevel })
    @IsOptional()
    @IsEnum(CourseLevel)
    level?: CourseLevel;
}

export class GetCourseAndStudentQueryDto {
    @ApiPropertyOptional({ example: 'asfeo2o3n', description: 'COurse Id' })
    @IsOptional()
    @IsString()
    id?: String;

    @ApiPropertyOptional({ example: 0, description: 'Offset qiymati' })
    @IsOptional()
    @IsNumber()
    offset?: number;

    @ApiPropertyOptional({ example: 10, description: 'Limit qiymati' })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ example: 'nodejs', description: 'Qidirilayotgan matn' })
    @IsOptional()
    @IsString()
    search?: string;
}
