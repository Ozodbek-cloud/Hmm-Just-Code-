import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CourseCategoryDto, UpdatedCourseCategoryDto } from './interfaces/course-category';

@Injectable()
export class CourseCategoryService {
    constructor(private prismaService: PrismaService) { }

    async create_category(payload: CourseCategoryDto) {
        let create = await this.prismaService.courseCategory.create({
            data: payload
        })
        return {
            success: true,
            message: "Successfully Created Course Category",
            data: create
        }
    }
    async get_all_course_category() {
        const all = await this.prismaService.courseCategory.findMany({
            include: {
                courses: {
                    select: {
                        name: true,
                        about: true,
                        price: true,
                        banner: true,
                        introVideo: true,
                        level: true,
                        published: true
                    }
                },
            },
        });
        return {
            success: true,
            message: "Successfully Getted All Course Category",
            data: all
        }
    }
    async get_one_course_category(id: number) {
        const one = await this.prismaService.courseCategory.findFirst({
            where: {
                id: id
            },
            include: {
                courses: {
                    select: {
                        name: true,
                        about: true,
                        price: true,
                        banner: true,
                        introVideo: true,
                        level: true,
                        published: true
                    }
                },
            },
        });
        if (!one) {
            throw new NotFoundException(`This ${id} is Not Found!`)
        }
        return {
            success: true,
            message: "Successfully Getted One Course Category",
            data: one
        }
    }

    async update_course_category(id: number, payload: UpdatedCourseCategoryDto) {
        let one_updated = await this.prismaService.courseCategory.update({
            where: {
                id: id
            },
            data: payload
        })

        if (!one_updated) {
            throw new NotFoundException(`This ${id} is Not Found!`)
        }

        return {
            success: true,
            message: "Successfully Updated Course Category",
            data: one_updated
        }
    }

    async delete_course_category(id: number) {
        const one_deleted = await this.prismaService.courseCategory.delete({
            where: {
                id: id
            },
        });
        if (!one_deleted) {
            throw new NotFoundException(`This ${id} is Not Found!`)
        }
        
        return {
            success: true,
            message: "Successfully  Deleted Course Category",
            data: one_deleted
        }
    }

}
