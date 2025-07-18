import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLessonDto {
  @ApiProperty({example: "Dars1", description: "Name of lesson"})
  @IsString()
  @IsNotEmpty()
  name: string
 
  @ApiProperty({example: "Very good", description: "About of lesson"})
  @IsString()
  @IsNotEmpty()
  about: string

  @ApiProperty({example: "video.mpt4", description: "Video of lesson", format: "binary"})
  @IsString()
  @IsNotEmpty()
  video: string

  @ApiProperty({example: "1", description: "Id of Group"})
  @IsNumber()
  @IsNotEmpty()
  groupId: number

}
