import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example: '+998948855888',
        description: 'Telephone Number',
    })
    @IsString()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        example: 'NoName',
        description: 'Full Name',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        example: '12345678',
        description: 'Password',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
export class CreateMentor {
    @ApiProperty({example: '+998945686677'})
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string

    @ApiProperty({example: 'Ozodbek Adminjonov'})
    @IsString()
    @IsNotEmpty()
    fullName: string

    @ApiProperty({example: 'cRcD+2WQNGu(_RS'})
    @IsString()
    @IsNotEmpty()
    password: string

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

export class CreateAsisstandDto {
    @ApiProperty({example: '+998945686677'})
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string

    @ApiProperty({example: 'Ozodbek Adminjonov'})
    @IsString()
    @IsNotEmpty()
    fullName: string

    @ApiProperty({example: 'cRcD+2WQNGu(_RS'})
    @IsString()
    @IsNotEmpty()
    password: string


    @ApiProperty({example: 'iefwbiew'})
    @IsString()
    @IsNotEmpty()
    courseId: string
}