import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateContactDto {
    @ApiProperty({
        example: 'NoName',
        description: 'Full Name',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        example: '+998948855888',
        description: 'Telephone Number',
    })
    @IsString()
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        example: 'Lorem Is Good',
        description: 'Message'
    })
    @IsString()
    message: string
}
