import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class CourseCategoryDto {
    @ApiProperty({ format: "binary", description: "Name Of Course Category" })
    @IsString()
    @IsNotEmpty()
    name: string
}
export class UpdatedCourseCategoryDto extends CourseCategoryDto {
    
}