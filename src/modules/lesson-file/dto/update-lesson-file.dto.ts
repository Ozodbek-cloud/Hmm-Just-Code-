import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class UpdateLessonFileDto {
    @ApiProperty({example: "Idk again", description: "For Update Note"})
    @IsString()
    @IsNotEmpty()
    note: string
}
