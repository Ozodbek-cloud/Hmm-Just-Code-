import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ example: '+998936588566' })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({ example: '00000' })
    @IsNumber()
    otp_code: number;

    @ApiProperty({ example: 'newStrongPassword123!' })
    @IsString()
    password: string;
}
