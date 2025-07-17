import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUserDto } from './interfaces/user-dto';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) { }


    async update_profile(id: number, payload: UpdateUserDto, image: Express.Multer.File) {
        const filename = image.filename;

        const updated = await this.prismaService.users.update({
            where: { id },
            data: {
                ...payload,
                ...(filename && { image: filename })
            },
        });

        return {
            success: true,
            message: 'Successfully Updated',
            data: updated,
        };
    }


    async get_all() {
        let all = await this.prismaService.users.findMany()
        return {
            success: true,
            message: 'Successfully Getted',
            data: all
        }
    }

    async get_one(id: number) {
        let one = await this.prismaService.users.findFirst({ where: { id: id } })
        if (!one) throw new NotFoundException(`This ${id} Is Not Found!`)

        return {
            success: true,
            message: 'Successfully Getted',
            data: one
        }
    }

}
