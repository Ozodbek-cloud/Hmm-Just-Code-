import { ApiProperty } from "@nestjs/swagger";
import { CourseLevel } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Type } from "class-transformer";
import { IsBoolean, IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @ApiProperty({example: "Php", description: "Name Of Course"})
    @IsString()
    @IsNotEmpty()
    name: string


    @ApiProperty({example: "All thigns", description: "Name Of Course"})
    @IsString()
    @IsNotEmpty()
    about: string

    @ApiProperty({example: 100000.00, description: "Price Of Course"})
    @IsDecimal()
    @IsNotEmpty()
    price: number

    @ApiProperty({example: "file.jpg", description: "Banner Of Course", format: "binary"})
    banner: string

    @ApiProperty({example: "video.mpt4", description: "IntroVideo Of Course", format: "binary"})
    introVideo: string

    @ApiProperty({example: "BEGINNER", description: "Level Of Course", enum: CourseLevel})
    @IsEnum(CourseLevel)
    @IsNotEmpty()
    level: CourseLevel

    @ApiProperty({example: false, description: "Is Published Of Course?"})
    @IsBoolean()
    @Type(() => Boolean)
    @IsNotEmpty()
    published: boolean

    @ApiProperty({example: 1, description: "CategoryId of Course"})
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    categoryId: number

    @ApiProperty({example: 1, description: "MentorId of Course"})
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    mentorId: number
}




