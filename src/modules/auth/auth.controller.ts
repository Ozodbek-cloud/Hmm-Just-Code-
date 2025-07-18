import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './interfaces/register.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './interfaces/loginDto';
import { ResetPasswordDto } from './interfaces/resetPassword.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './interfaces/refresh-token';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @ApiOperation({ summary: "Foydalanuvchini Login qilish" })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiResponse({ status: 404, description: 'UnSuccess' })
    @Post('login')
    Login(@Body() payload: LoginDto) {
        return this.authService.login(payload)
    }

    @ApiOperation({ summary: "Foydalanuvchini Register qilish va Emailga code jonatish" })
    @ApiResponse({ status: 201, description: 'Registered' })
    @ApiResponse({ status: 404, description: 'Not Registered' })
    @Post('register')
    Register(@Body() payload: RegisterDto) {
        return this.authService.register(payload)
    }

    @ApiOperation({ summary: 'Tokenni yangilash (agar muddati tugagan bo‘lsa)' })
    @ApiResponse({ status: 200, description: 'Yangi token berildi yoki hali tugamagan' })
    @ApiResponse({ status: 401, description: 'Noto‘g‘ri yoki yaroqsiz token' })
    @Post('refresh-token')
    RefreshToken(@Body() body: RefreshTokenDto) {
        return this.authService.refresh_token(body);
    }

    @ApiOperation({ summary: "Foydalanuvchini reset password" })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiResponse({ status: 404, description: 'UnSuccess' })
    @Post('reset-password')
    ResetPassword(@Body() payload: ResetPasswordDto) {
        return this.authService.reset_password(payload)
    }

}
