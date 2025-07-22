import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'Yangi vazifa matni', description: 'Vazifa tavsifi' })
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiProperty({ example: 'file.pdf', description: 'Fayl nomi', required: false, format: "binary" })
  @IsString()
  @IsOptional()
  file?: string;

  @ApiProperty({ example: 'abc123', description: 'Dars IDsi' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}
