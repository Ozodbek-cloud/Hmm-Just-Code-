import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendOtpDto, VerifyOtpDto } from './interfaces/verification.dto';
import { EverificationTypes } from 'src/common/types/verification';
import { RedisService } from 'src/common/redis/redis.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { generateOtp } from 'src/common/utils/random';
import { secToMills } from 'src/common/utils/times';
import { SmsService } from 'src/common/services/services.service';

@Injectable()
export class VerificationService {
    constructor(private redisService: RedisService, private prismaService: PrismaService, private smsService: SmsService) { }

    public getKey(type: EverificationTypes, phone: string, confirmation?: boolean) {
        const storeKeys: Record<EverificationTypes, string> = {
            [EverificationTypes.REGISTER]: 'reg_',
            [EverificationTypes.RESET_PASSWORD]: 'respass_',
            [EverificationTypes.EDIT_PHONE]: 'edph_'
        }
        let key = storeKeys[type]
        if (confirmation) {
            key += 'cfm_'
        }
        key += phone
        return key
    }

    private async throwIfUserExists(phone: string) {
        const user = await this.prismaService.users.findUnique({ where: { phone: phone, }, })

        if (user) {
            throw new HttpException('Phone Already Exists', HttpStatus.BAD_REQUEST)
        }
        return user
    }

    private async throwIfNotUserExists(phone: string) {
        const user = await this.prismaService.users.findUnique({ where: { phone: phone, }, })

        if (!user) {
            throw new HttpException('Phone Not Found', HttpStatus.NOT_FOUND)
        }
        return user
    }

    private getMessage(type: EverificationTypes, otp: string) {
        switch (type) {
            case EverificationTypes.REGISTER:
                return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
            case EverificationTypes.RESET_PASSWORD:
                return `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
            case EverificationTypes.EDIT_PHONE:
                return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
        }

    }

    async send_otp(payload: SendOtpDto) {
    const { type, phone } = payload
    const key = this.getKey(type, phone);
    const session = await this.redisService.get(key)

    if (session) {
        throw new HttpException(
            'Code already sent to user',
            HttpStatus.BAD_REQUEST
        )
    }

    switch (type) {
        case EverificationTypes.REGISTER:
            await this.throwIfUserExists(phone)
            break;
        case EverificationTypes.EDIT_PHONE:
        case EverificationTypes.RESET_PASSWORD:
            await this.throwIfNotUserExists(phone)
            break;
        default:
            throw new HttpException(
                'Invalid verification type',
                HttpStatus.BAD_REQUEST
            )
    }

    const otp = generateOtp()
    let code = await this.redisService.set(key, JSON.stringify(otp), secToMills(120));
    console.log(code)
    await this.smsService.sendSMS(this.getMessage(type, otp)!, phone)
    return { message: "Confirm send code to user"}
}

    async verifyOtp(payload: VerifyOtpDto) {
        const { type, phone, otp } = payload
        const session = await this.redisService.get(
            this.getKey(type, phone)
        );
        if (!session) {
            throw new HttpException('OTP expired!', HttpStatus.BAD_REQUEST);
        }
        if (otp !== JSON.parse(session)) {
            throw new HttpException('Invalid Otp!', HttpStatus.BAD_REQUEST)
        }

        await this.redisService.del(this.getKey(type, phone))
        await this.redisService.set(
            this.getKey(type, phone, true),
            JSON.stringify(otp),
            secToMills(300)
        );
        return {
            success: true,
            message: 'Verified'
        }
    }

    async CheckConfirmOtp(payload: VerifyOtpDto) {
        const { type, phone, otp } = payload
        console.log(type, otp, phone)
        const session = await this.redisService.get(
            this.getKey(type, phone, true)
        );

        console.log(session)
        console.log(this.getKey(type, phone))
        if (!session) {
            throw new HttpException('Session expired!', HttpStatus.BAD_REQUEST);
        }
        if (otp !== JSON.parse(session)) {
            throw new HttpException('Invalid Otp!', HttpStatus.BAD_REQUEST)
        }

        await this.redisService.del(this.getKey(type, phone, true))

        return true

    }

}
