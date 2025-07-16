import { Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
import { JwtAccessToken, JWtRefreshToken } from 'src/common/utils/jwt-utils';
import { PrismaService } from 'src/core/prisma/prisma.service';


interface JwtPayload {
    id: number,
    role: string
}

@Controller('auth')
export class AuthController {
    constructor(private prismaService: PrismaService, private redisService: RedisService, private jwtService: JwtService) { }

    private async generateToken(payload: JwtPayload, accessTokenOnly = false) {
        const accessToken = await this.jwtService.signAsync(payload, JwtAccessToken);
        if (accessTokenOnly) {
            return { accessToken };
        }

        const refreshToken = await this.jwtService.signAsync(
            { id: payload.id },
            JWtRefreshToken
        );

        return { accessToken, refreshToken };
    }

    
}
