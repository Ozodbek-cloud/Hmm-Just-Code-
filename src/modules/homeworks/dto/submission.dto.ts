import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SubmissionDto{
    @ApiProperty({example: "file.txt", description: "File Of Homework", required: false, format: "binary"})
    @IsString()
    @IsOptional()
    @Type(() => String)
    file: string

    @ApiProperty({example: "birnarsa", description: "Message Of Homework", required: false})
    @IsString()
    @IsOptional()
    @Type(() => String)
    text: string
}
export class CheckDto{
    @ApiProperty({example: "IsAproved?", description: "Check Of HomeworkSub"})
    @IsBoolean()
    @Type(() => Boolean)
    approved: boolean

    @ApiProperty({example: "birnarsa", description: "Message Of HomeworkSub", required: false})
    @IsString()
    @IsOptional()
    @Type(() => String)
    reason: string
}