import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
import { JwtAccessToken, JWtRefreshToken } from 'src/common/utils/jwt-utils';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RegisterDto } from './interfaces/register.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyDto } from './interfaces/verifydto';
import { LoginDto } from './interfaces/loginDto';
import { SendVerifyDto } from './interfaces/sendVerify.dto';
import { ResetPasswordDto } from './interfaces/resetPassword.dto';
import { AuthService } from './auth.service';


interface JwtPayload {
    id: number,
    role: string
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: "Foydalanuvchini Register qilish va Emailga code jonatish" })
    @ApiResponse({ status: 201, description: 'Registered' })
    @ApiResponse({ status: 404, description: 'Not Registered' })
    @Post('register')
    Register(@Body() payload: RegisterDto) {
        return this.authService.register(payload)
    }

    @ApiOperation({ summary: "Foydalanuvchini Otp code bilan tasdiqlash" })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiResponse({ status: 404, description: 'UnSuccess' })
    @Post('verify')
    Verify(@Body() payload: VerifyDto) {
        return this.authService.verify(payload)
    }

    @ApiOperation({ summary: "Foydalanuvchini Login qilish" })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiResponse({ status: 404, description: 'UnSuccess' })
    @Post('login')
    Login(@Body() payload: LoginDto) {
        return this.authService.login(payload)
    }

    // @ApiOperation({ summary: "Foydalanuvchiga code yuborish reset password uchun" })
    // @ApiResponse({ status: 200, description: 'Success' })
    // @ApiResponse({ status: 404, description: 'UnSuccess' })
    // @Post('send-verify')
    // SendVerify(@Body() payload: SendVerifyDto) {
    //     return this.authService(payload)
    // }

    // @ApiOperation({ summary: "Foydalanuvchini reset password" })
    // @ApiResponse({ status: 200, description: 'Success' })
    // @ApiResponse({ status: 404, description: 'UnSuccess' })
    // @Post('reset-password')
    // ResetPassword(@Body() payload: ResetPasswordDto) {
    //     return this.authService(payload)
    // }



}
