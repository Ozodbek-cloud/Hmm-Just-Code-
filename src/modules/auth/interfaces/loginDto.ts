import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty({example: '+998945686677'})
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string

    @ApiProperty({example: 'cRcD+2WQNGu(_RS'})
    @IsString()
    @IsNotEmpty()
    password: string
}