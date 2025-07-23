import { Injectable } from '@nestjs/common';
import { CreatePurchasedCourseDto } from './dto/create-purchased-course.dto';
import { UpdatePurchasedCourseDto } from './dto/update-purchased-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class PurchasedCoursesService {
  constructor(private PrismaService: PrismaService) {}
  
  create(createPurchasedCourseDto: CreatePurchasedCourseDto) {
    return 'This action adds a new purchasedCourse';
  }

  async findAll(query: any) {
    const limit = query.limit ? parseInt(query.limit) : 10
    const offset = query.offset ? parseInt(query.offset) : 0

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
      filters.categoryId = parseInt(query.categoryId);
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
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} purchasedCourse`;
  }

  update(id: number, updatePurchasedCourseDto: UpdatePurchasedCourseDto) {
    return `This action updates a #${id} purchasedCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchasedCourse`;
  }
}
