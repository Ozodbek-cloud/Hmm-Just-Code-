import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty({example: '+9988454455'})
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string

    @ApiProperty({example: '12345678'})
    @IsString()
    @IsNotEmpty()
    password: string
}