import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({ description: 'Yangilanish uchun token' })
    @IsString()
    token: string;
}