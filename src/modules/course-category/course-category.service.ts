import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CourseCategoryDto, UpdatedCourseCategoryDto } from './interfaces/course-category';

@Injectable()
export class CourseCategoryService {
    constructor(private prismaService: PrismaService) { }

    async create_category(payload: CourseCategoryDto) {
        try {
            const created = await this.prismaService.courseCategory.create({
                data: payload,
            });

            return {
                success: true,
                message: "Successfully Created Course Category",
                data: created,
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async get_all_course_category(query: any) {
        try {
            const limit = query.limit ? parseInt(query.limit) : 10;
            const offset = query.offset ? parseInt(query.offset) : 0;
            const takeAll = query.limit === '0' || limit === 0;

            const total = await this.prismaService.courseCategory.count();
            const totalPages = takeAll ? 1 : Math.ceil(total / limit);

            const data = await this.prismaService.courseCategory.findMany({
                skip: offset,
                ...(takeAll ? {} : { take: limit }),
                include: {
                    courses: {
                        select: {
                            name: true,
                            about: true,
                            price: true,
                            banner: true,
                            introVideo: true,
                            level: true,
                            published: true,
                        },
                    },
                },
            });

            return {
                success: true,
                message: `Successfully retrieved Course Categories`,
                data,
                pagination: {
                    total,
                    offset,
                    limit: takeAll ? total : limit,
                    pages: totalPages,
                },
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);

        }
    }


    async get_one_course_category(id: number) {
        try {
            const one = await this.prismaService.courseCategory.findFirst({
                where: { id },
                include: {
                    courses: {
                        select: {
                            name: true,
                            about: true,
                            price: true,
                            banner: true,
                            introVideo: true,
                            level: true,
                            published: true,
                        },
                    },
                },
            });

            if (!one) {
                throw new NotFoundException(`Course category with ID ${id} not found`);
            }

            return {
                success: true,
                message: "Successfully Retrieved One Course Category",
                data: one,
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    async update_course_category(id: number, payload: UpdatedCourseCategoryDto) {
        try {
            const updated = await this.prismaService.courseCategory.update({
                where: { id },
                data: payload,
            });

            return {
                success: true,
                message: "Successfully Updated Course Category",
                data: updated,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Course category with ID ${id} not found`);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async delete_course_category(id: number) {
        try {
            const deleted = await this.prismaService.courseCategory.delete({
                where: { id },
            });

            return {
                success: true,
                message: "Successfully Deleted Course Category",
                data: deleted,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Course category with ID ${id} not found`);
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
