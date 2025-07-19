import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5, description: 'Reyting bahosi (1-5)' })
  rate: number;

  @ApiProperty({ example: 'Juda yaxshi kurs!', description: 'Foydalanuvchi fikri' })
  comment: string;

  @ApiProperty({ example: 'abc123', description: 'Kurs ID' })
  courseId: string;

}
