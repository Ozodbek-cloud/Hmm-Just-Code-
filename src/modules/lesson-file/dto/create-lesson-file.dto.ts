import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLessonFileDto {
    @ApiProperty({ example: "birnima.jpg", description: "File Of Lesson File", format: "binary" })
    file: string

    @ApiProperty({ example: "birnasadadas", description: "Id Of Lesson" })
    @IsString()
    @IsNotEmpty()
    lessonId: string

    @ApiProperty({example: "Idk", description: "Note Of Lesson File", required: false})
    @IsString()
    @IsOptional()
    note : string

}
