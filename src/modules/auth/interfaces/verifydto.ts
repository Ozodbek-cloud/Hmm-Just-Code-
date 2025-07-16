import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class VerifyDto {
    @ApiProperty({
        example: '+998948855888',
        description: 'Telephone Number',
    })
    @IsString()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

}