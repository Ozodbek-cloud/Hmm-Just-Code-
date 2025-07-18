import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Update_Mentor_ProfileDto } from './interfaces/update-mentor';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class MentorProfilesService {
    constructor(private prismaService: PrismaService) {}

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

    async get_all() {
        try {
            const all = await this.prismaService.mentorProfile.findMany();

            return {
                success: true,
                message: 'Successfully Retrieved All Mentor Profiles',
                data: all,
            };
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving all mentor profiles: ${error.message}`);
        }
    }

    async get_one_by_id(id: number) {
        try {
            const one = await this.prismaService.mentorProfile.findFirst({
                where: { id:id },
            });

            if (!one) {
                throw new NotFoundException(`Mentor with ID ${id} not found`);
            }

            return {
                success: true,
                message: 'Successfully Retrieved One Mentor Profile',
                data: one,
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(`Error retrieving mentor by ID: ${error.message}`);
        }
    }

    async get_one_by_job(job: string) {
        try {
            const jobMatches = await this.prismaService.mentorProfile.findMany({
                where: { job:job },
            });

            if (!jobMatches || jobMatches.length === 0) {
                throw new NotFoundException(`No mentors found with job: ${job}`);
            }

            return {
                success: true,
                message: 'Successfully Retrieved Mentors by Job',
                data: jobMatches,
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(`Error retrieving mentors by job: ${error.message}`);
        }
    }

    async get_one_by_experience(experience: number) {
        try {
            const experienced = await this.prismaService.mentorProfile.findMany({
                where: { experience },
            });

            if (!experienced || experienced.length === 0) {
                throw new NotFoundException(`No mentors found with ${experience} years experience`);
            }

            return {
                success: true,
                message: 'Successfully Retrieved Mentors by Experience',
                data: experienced,
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(`Error retrieving mentors by experience: ${error.message}`);
        }
    }
}
