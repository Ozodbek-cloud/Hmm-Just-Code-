import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty({example: '+998945683699'})
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string

    @ApiProperty({example: 'cRcD+2WQNGu('})
    @IsString()
    @IsNotEmpty()
    password: string
}