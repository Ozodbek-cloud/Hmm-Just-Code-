import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class UpdatePhone {
    @ApiProperty({
        example: '+998948855888',
        description: 'Telephone Number',
    })
    @IsString()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        example: '00000',
        description: 'Otp Code',
    })
    @IsString()
    @IsNotEmpty()
    otp_code: string

}