import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdatePhone } from './interfaces/phone-dto';
import { VerificationService } from '../verification/verification.service';
import { EverificationTypes } from 'src/common/types/verification';
import { RedisService } from 'src/common/redis/redis.service';
import { Updated_Password } from './interfaces/password-dto';
import * as bcrypt from "bcrypt"
import { UpdateLastActivityDto } from './interfaces/last-activity';
import { Update_Mentor_ProfileDto } from '../mentor-profiles/interfaces/update-mentor';
@Injectable()
export class ProfileService {
    constructor(private prismaService: PrismaService, private verificationService: VerificationService, private redisService: RedisService) { }

    async update_profile(id: number, image: Express.Multer.File) {
        try {
            const filename = image.filename;

            const updated = await this.prismaService.users.update({
                where: { id },
                data: {
                    ...(filename && { image: filename }),
                },
            });

            return {
                success: true,
                message: 'Successfully Updated',
                data: updated,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async get_all() {
        try {
            const all = await this.prismaService.users.findMany();

            return {
                success: true,
                message: 'Successfully Retrieved All Users',
                data: all,
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async get_one(id: number) {
        try {
            const one = await this.prismaService.users.findFirst({
                where: { id },
            });

            if (!one) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            return {
                success: true,
                message: 'Successfully Retrieved User',
                data: one,
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    async update_phone(user_id: number, payload: UpdatePhone) {
        const { phone, otp_code } = payload;
        await this.verificationService.CheckConfirmOtp({
            type: EverificationTypes.EDIT_PHONE,
            phone,
            otp: otp_code,
        });

        try {
            let stored = await this.redisService.get(payload.phone)
            if (!stored) throw new BadRequestException("Otp expire or not Found")

            let UserData = JSON.parse(stored)
            if (UserData.otp_code !== payload.otp_code) {
                throw new BadRequestException("Otp invalide")
            }

            await this.redisService.del(payload.phone)

            const updated = await this.prismaService.users.update({
                where: { id: user_id },
                data: { phone },
            });

            await this.redisService.del(`otp:${EverificationTypes.EDIT_PHONE}:${phone}`);

            return {
                success: true,
                message: 'Telefon raqam muvaffaqiyatli yangilandi',
                data: updated,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User with ID ${user_id} not found`);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async getLastActivity(userId: number) {
        try {
            const activity = await this.prismaService.lastActivity.findUnique({
                where: { userId },
            });

            if (!activity) {
                throw new NotFoundException(`Last activity not found for user ID ${userId}`);
            }

            return {
                success: true,
                message: 'Last activity retrieved successfully',
                data: activity,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateLastActivity(userId: number, dto: UpdateLastActivityDto) {
        try {
            const existing = await this.prismaService.lastActivity.findUnique({
                where: { userId },
            });

            if (!existing) {
                const created = await this.prismaService.lastActivity.create({
                    data: {
                        userId,
                        ...dto,
                    },
                });
                return {
                    success: true,
                    message: 'Last activity created successfully',
                    data: created,
                };
            }

            const updated = await this.prismaService.lastActivity.update({
                where: { userId },
                data: dto,
            });

            return {
                success: true,
                message: 'Last activity updated successfully',
                data: updated,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async update_password(user_id: number, payload: Updated_Password) {
        try {
            const { password, newPassword } = payload;

            const one_user = await this.prismaService.users.findFirst({
                where: { id: user_id },
            });

            if (!one_user) {
                throw new NotFoundException(`User with ID ${user_id} not found`);
            }

            const isMatch = await bcrypt.compare(password, one_user.password);
            if (!isMatch) {
                throw new BadRequestException(`Current password is incorrect`);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const updated = await this.prismaService.users.update({
                where: { id: user_id },
                data: {
                    password: hashedPassword,
                },
            });

            return {
                success: true,
                message: 'Password successfully updated',
                data: updated,
            };
        } catch (error) {
           throw new InternalServerErrorException(error.message)
        }
    }

    async update(id: number, payload: Partial<Update_Mentor_ProfileDto>) {
        try {
            const updated = await this.prismaService.mentorProfile.update({
                where: { user_id: id },
                data: { ...payload, user_id: id },
            });

            return {
                success: true,
                message: 'Successfully Updated Mentor Profile',
                data: updated,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Mentor with user_id ${id} not found`);
            }
            throw new InternalServerErrorException(`Error updating mentor profile: ${error.message}`);
        }
    }


}
