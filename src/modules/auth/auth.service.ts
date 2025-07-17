import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
import { JwtAccessToken, JWtRefreshToken } from 'src/common/utils/jwt-utils';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RegisterDto } from './interfaces/register.dto';
import { VerifyDto } from './interfaces/verifydto';
import * as bcrypt from "bcrypt"
import { LoginDto } from './interfaces/loginDto';

interface JwtPayload {
    id: number,
    role: string
}

@Injectable()
export class AuthService {

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

    async register(payload: Required<RegisterDto>) {
        let fullname = await this.prismaService.users.findFirst({ where: { fullName: payload.fullName } })
        if (fullname) throw new ConflictException(`${payload.fullName} is already registered!`)
        let phone = await this.prismaService.users.findFirst({ where: { phone: payload.phone } })
        if (phone) throw new ConflictException(`${payload.phone} is already exists!`)


        // await this.redisService.set(`register:${payload.phone}`, JSON.stringify({ ...payload, code }), 600)

        return {
            message: `Verification Successfully send to ${payload.phone}`
        }
    }

    async verify(payload: Required<VerifyDto>) {
        let stored = await this.redisService.get(`register:${payload.otp_code}`)
        if (!stored) throw new BadRequestException("Otp expire or not Found")

        let userData = JSON.parse(stored)
        if (userData.code != payload.otp_code) throw new BadRequestException("Otp invalide")

        await this.redisService.del(`register:${payload.otp_code}`)
        delete userData.code

        let hash = await bcrypt.hash(userData.password, 10)
        let user = await this.prismaService.users.create({ ...userData, password: hash })

        let token = await this.generateToken({ id: user.id, role: user.role })
        return { message: "SuccessFully Registered" }
    }

    async login(payload: Required<LoginDto>) {
        let exists = await this.prismaService.users.findFirst({
            where: {
                phone: payload.phone
            }
        })
        if (!exists) throw new NotFoundException(`this ${payload.phone} is not found`)
        let compare = await bcrypt.compare(payload.password, exists.password)
        if (!compare) throw new NotFoundException(`this ${payload.password} is not match`)

        let token = await this.generateToken({ id: exists.id, role: exists.role })
        return { success: true, data: exists, token: token }
    }
}
