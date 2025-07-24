import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateRatingDto } from './interfaces/create-category-rating.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CategoryRatingService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: number, payload: CreateRatingDto) {
    try {
      const created = await this.prismaService.rating.create({
        data: { ...payload, userId: userId },
      });
      return {
        success: true,
        message: 'Successfully Created Rating',
        data: created,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const all = await this.prismaService.rating.findMany({
        include: {
          users: {
            select: {
              id: true,
              fullName: true,
              image: true,
            },
          },
          courses: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return {
        success: true,
        message: 'Successfully Retrieved All Ratings',
        data: all,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllByCourseId(courseId: string, query: any) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10;
      const page = query.page ? parseInt(query.page) : 1;
      const offset = (page - 1) * limit;

      const where = { courseId };

      const total = await this.prismaService.rating.count({ where });

      const data = await this.prismaService.rating.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          users: {
            select: {
              id: true,
              fullName: true,
              image: true,
            },
          },
        },
      });

      return {
        success: true,
        message: `Successfully retrieved ratings for course ${courseId}`,
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAnalytics(courseId: string) {
    try {
      const ratings = await this.prismaService.rating.findMany({
        where: { courseId },
        select: { rate: true },
      });

      const stats = { one: 0, two: 0, three: 0, four: 0, five: 0 };
      let total = 0;

      for (const r of ratings) {
        const val = Math.round(r.rate);
        if (val === 1) stats.one++;
        else if (val === 2) stats.two++;
        else if (val === 3) stats.three++;
        else if (val === 4) stats.four++;
        else if (val === 5) stats.five++;
        total += r.rate;
      }

      const average = ratings.length > 0 ? total / ratings.length : 0;

      return {
        rate: parseFloat(average.toFixed(1)),
        ...stats,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const one = await this.prismaService.rating.delete({
        where: { id },
      });
      return {
        success: true,
        message: 'Successfully Deleted One Rating',
        data: one,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Rating with ID ${id} not found`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
