import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class Updated_Password {
    @ApiProperty({
        example: '12345678',
        description: 'Passowrd Of User',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: '87654321',
        description: 'New Password of User',
    })
    @IsString()
    @IsNotEmpty()
    newPassword: string
}