import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ format: "binary", description: "Image Of User" })
    @IsString()
    image: string
}