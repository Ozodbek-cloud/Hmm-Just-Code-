import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetQuestionsAnswerQueryDto {
    @ApiPropertyOptional({ example: 10, description: 'Number of results to return (limit)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ example: '1', description: 'Page number' })
    @IsOptional()
    @IsNumberString()
    page?: string;

    @ApiPropertyOptional({ example: 0, description: 'Number of results to skip (offset)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset?: number;

    @ApiPropertyOptional({ example: true, description: 'Filter by read status (true = read, false = unread)' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    read?: boolean;

    @ApiPropertyOptional({ example: 'clz3q52d60001sf7s9tx8lq6b', description: 'Filter by Course ID' })
    @IsOptional()
    @IsString()
    courseId?: string;
}
