import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

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
            throw new InternalServerErrorException(`Error updating user: ${error.message}`);
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
            throw new InternalServerErrorException(`Error retrieving users: ${error.message}`);
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
            throw new InternalServerErrorException(`Error retrieving user: ${error.message}`);
        }
    }
}
