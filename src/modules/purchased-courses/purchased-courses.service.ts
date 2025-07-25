import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePurchasedCourseDto } from './interfaces/create-purchased-course.dto';
import { UpdatePurchasedCourseDto } from './interfaces/update-purchased-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaidVia } from '@prisma/client';
import { GetCourseAndStudentQueryDto, GetPurchasedQueryDto } from './interfaces/query-dto';

@Injectable()
export class PurchasedCoursesService {
  constructor(private prismaService: PrismaService) { }

  async purchaseCourse(courseId: string, userId: number) {
    try {
      const course = await this.prismaService.course.findUnique({ where: { id: courseId } });
      if (!course) throw new NotFoundException('Kurs topilmadi');

      let created = await this.prismaService.purchasedCourse.create({
        data: {
          courseId,
          userId,
          amount: course.price,
          paidVia: PaidVia.PAYME,
        },
      });
      return {
        success: true,
        message: "Successfully Created Purchased",
        data: created
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getAll(userId: number, query: GetPurchasedQueryDto) {
    try {
      const limit = query.limit ? query.limit : 10
      const offset = query.offset ? query.offset : 0

      const filters: any = {};

      if (query.search) {
        filters.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { about: { contains: query.search, mode: 'insensitive' } }
        ];
      }

      if (query.level) {
        filters.level = query.level;
      }

      if (query.categoryId) {
        filters.categoryId = (query.categoryId);
      }

      const total = await this.prismaService.course.count({
        where: filters,
      });

      const totalPages = Math.ceil(total / limit);

      const data = await this.prismaService.course.findMany({
        where: filters,
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        message: "Courses fetched successfully",
        data,
        pagination: {
          total,
          limit,
          offset,
          pages: totalPages,
        },
      };

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getOne(courseId: string, userId: number) {
    try {
      const purchased = await this.prismaService.purchasedCourse.findUnique({
        where: {
          courseId_userId: {
            courseId,
            userId,
          },
        },
        include: {
          courses: {
            select: {
              name: true,
              about: true,
              level: true,
              price: true,
              published: true
            }
          },
          users: {
            select: {
              fullName: true,
              image: true
            }
          }
        }
      });
      if (!purchased) throw new NotFoundException('Kurs sotib olinmagan');
      return {
        success: true,
        message: "Successfully Getted Purchased",
        data: purchased
      };
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async createPurchasedCourse(payload: CreatePurchasedCourseDto) {
    const user = await this.prismaService.users.findUnique({
      where: { phone: payload.phone },
    });

    if (!user) {
      throw new NotFoundException('User not found with this phone number');
    }

    const purchased = await this.prismaService.purchasedCourse.create({
      data: {
        courseId: payload.courseId,
        userId: user.id,
        paidVia: PaidVia.CASH,
        amount: null,
      },
    });

    return {
      success: true,
      message: "Successfully Purchased",
      data: purchased
    }
  }

  async getCourse_To_Student(query: GetCourseAndStudentQueryDto) {
    try {
      const limit = query.limit ? query.limit : 10
      const offset = query.offset ? query.offset : 0

      const filters: any = {};

      if (query.search) {
        filters.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { about: { contains: query.search, mode: 'insensitive' } }
        ];
      }


      if (query.id) {
        filters.id = (query.id);
      }

      const total = await this.prismaService.course.count({
        where: filters,
      });

      const totalPages = Math.ceil(total / limit);

      const data = await this.prismaService.course.findMany({
        where: filters,
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        message: "Courses fetched successfully",
        data,
        pagination: {
          total,
          limit,
          offset,
          pages: totalPages,
        },
      };

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

}
