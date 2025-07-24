import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson-group.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class LessonGroupsService {
  constructor(private prismaService: PrismaService) { }

  async create(payload: CreateLessonGroupDto) {
    try {
      let created = await this.prismaService.lessonGroup.create({
        data: payload
      })
      return {
        success: true,
        message: "Successfully Created LessonGroup",
        data: created
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAllByCourseId(courseId: string, query: any) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const includeLessons = query.include_lessons === 'true';

      const total = await this.prismaService.lessonGroup.count({ where: { courseId } });
      const totalPages = Math.ceil(total / limit);

      const data = await this.prismaService.lessonGroup.findMany({
        where: { courseId },
        skip: offset,
        take: limit,
        include: {
          lessons: includeLessons,
        },
      });

      return {
        success: true,
        message: `Successfully retrieved Lesson Groups for Course ${courseId}`,
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

  async findOne(id: number) {
    try {
      let findone = await this.prismaService.lessonGroup.findFirst({
        where: { id: id },
        include: {
          courses: {
            select: {
              name: true,
              about: true,
              price: true,
              introVideo: true,
              level: true,
              published: true
            },
          },
          lastActivity: {
            select: {
              userId: true,
              url: true
            }
          },
          lessons: {
            select: {
              name: true,
              about: true,
              video: true
            },
          },
          exam: {
            select: {
              question: true,
              variantA: true,
              variantB: true,
              variantC: true,
              variantD: true,
              answer: true
            }
          },
          examResult: {
            select: {
              userId: true,
              passed: true,
              corrects: true,
              wrongs: true
            }
          }
        }
      })
      if (!findone) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: "Successfully Getted One LessonGroup",
        data: findone
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, payload: UpdateLessonGroupDto) {
    try {
      let updated = await this.prismaService.lessonGroup.update({
        where: {
          id: id
        },
        data: payload
      })
      if (!updated) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: 'Successfully Updated LessonGroup',
        data: updated
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try {
      let deleted = await this.prismaService.lessonGroup.delete({
        where: {
          id: id
        }
      })
      if (!id) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: "Successfully Deleted LessonGroup",
        data: deleted
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async get_all() {
    try {
      return await this.prismaService.lessonGroup.findMany()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
