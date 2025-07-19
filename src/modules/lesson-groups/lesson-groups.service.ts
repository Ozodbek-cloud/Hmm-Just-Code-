import { Injectable } from '@nestjs/common';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson-group.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class LessonGroupsService {
  constructor(private prismaService: PrismaService) { }

  async create(payload: CreateLessonGroupDto) {
    let created = await this.prismaService.lessonGroup.create(
      {
        data: payload
      }
    )
    return {
      success: true,
      message: "Successfully Created LessonGroup",
      data: created
    }
  }

  async findAllByCourseId(courseId: string, query: any) {
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
  }


  async findOne(id: string) {
    let findone = await this.prismaService.lessonGroup.findFirst({
      where: {
        courseId: id
      },
      include: {
        courses:{
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
        }
      }
    })
  }

  async update(id: number, updateLessonGroupDto: UpdateLessonGroupDto) {
    return `This action updates a #${id} lessonGroup`;
  }

  async remove(id: number) {
    return `This action removes a #${id} lessonGroup`;
  }
}
