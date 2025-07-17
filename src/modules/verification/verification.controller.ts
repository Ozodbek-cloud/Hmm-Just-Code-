import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { EverificationTypes } from 'src/common/types/verification';
import { SendOtpDto, VerifyOtpDto } from './interfaces/verification.dto';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
    constructor(private readonly verificationService: VerificationService) { }

    @ApiOperation({
        description: `Valid Types:
    ${EverificationTypes.REGISTER}
    ${EverificationTypes.RESET_PASSWORD}
    ${EverificationTypes.EDIT_PHONE}`
    })
    @Post('send')
    sendOtp(@Body() body: SendOtpDto) {
        return this.verificationService.send_otp(body)
    }

    @ApiOperation({
        description: `Valid Types:
    ${EverificationTypes.REGISTER}
    ${EverificationTypes.RESET_PASSWORD}
    ${EverificationTypes.EDIT_PHONE}`
    })
    @Post('verify')
    VerifyOtp(@Body() body: VerifyOtpDto) {
        return this.verificationService.verifyOtp(body)
    }

}
