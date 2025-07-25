import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class RegisterDto {
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
  otp: string

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
