import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class Update_Mentor_ProfileDto {
    @ApiProperty({ example: "Software engineer with 5+ years of experience", description: "Short bio or about section" })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    about?: string;

    @ApiProperty({ example: "Software Engineer", description: "Mentor's job title" })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    job: string;


    @ApiProperty({ example: 5, description: "Years of experience" })
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    experience: number;

    @ApiProperty({ example: "@mentor_handle", description: "Telegram username or link" })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    telegram: string;

    @ApiProperty({ example: "https://instagram.com/mentor", description: "Instagram profile URL" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    instagram: string;

    @ApiProperty({ example: "https://linkedin.com/in/mentor", description: "LinkedIn profile URL" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    linkedin: string;

    @ApiProperty({ example: "https://facebook.com/mentor", description: "Facebook profile URL" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    facebook: string;

    @ApiProperty({ example: "https://github.com/mentor", description: "GitHub Link" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    github: string

    @ApiProperty({ example: "https://portfolio/mentor", description: "Any Website of User, For example Portfolio Link" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    website: string

    
}