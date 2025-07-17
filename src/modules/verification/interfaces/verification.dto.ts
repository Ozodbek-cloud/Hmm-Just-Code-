import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMobilePhone, IsString } from "class-validator";
import { EverificationTypes } from "src/common/types/verification";



export class SendOtpDto {
    @ApiProperty({
        enum: EverificationTypes,
    })
    @IsEnum(EverificationTypes)
    type: EverificationTypes

    @ApiProperty({
        example: '+998975661099'
    })
    @IsMobilePhone('uz-UZ')
    @IsString()
    phone: string
}

export class VerifyOtpDto extends SendOtpDto {
    @ApiProperty({
        example: '000000'
    })
    @IsString()
    otp: string
}