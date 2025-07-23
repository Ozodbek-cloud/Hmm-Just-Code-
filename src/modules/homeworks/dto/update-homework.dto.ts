import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHomeworkDto } from './create-homework.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateHomeworkDto  {    
      @ApiProperty({ example: 'Yangi vazifa matni', description: 'Vazifa tavsifi' })
      @IsString()
      @IsNotEmpty()
      task: string;
    
      @ApiProperty({ example: 'file.pdf', description: 'Fayl nomi', required: false, format: "binary" })
      @IsString()
      @IsOptional()
      file?: string;
}
