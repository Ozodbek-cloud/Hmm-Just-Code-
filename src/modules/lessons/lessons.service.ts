import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from '../lessons/interfaces/create-lesson.dto';
import { UpdateLessonDto } from '../lessons/interfaces/update-lesson.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { deleteMovieFile } from 'src/common/utils/delere-utils';
import path from 'path';

@Injectable()
export class LessonsService {
  constructor(private prismaService: PrismaService) { }
  async create(payload: CreateLessonDto, video: Express.Multer.File) {
    let video_url = video.filename
    let created = await this.prismaService.lesson.create(
      {
        data: {
          ...payload, video: video_url
        }
      }
    )

    return {
      success: true,
      message: "Successfully Created Lesson",
      data: created
    }
  }
  async get_by_detail(id: string) {
    let detail = await this.prismaService.lesson.findFirst({
      where: {
        id: id
      },
      include:
      {
        lastActivity: {
          select: {
            userId: true
          }
        },
        lessonView: {
          select: {
            userId: true,
            view: true
          },
        },
        lessonFile: {
          select: {
            id: true,
            file: true,
            note: true
          }
        }
      }
    })
    if (!detail) throw new NotFoundException(`this ${id} is not found`)

    return {
      success: true,
      message: "Successfully Getted Details Of Lesson",
      data: detail
    }
  }

  async findAll() {
    let all = await this.prismaService.lesson.findMany(
      {
        include:
        {
          lastActivity: {
            select: {
              userId: true
            }
          },
          lessonView: {
            select: {
              userId: true,
              view: true
            },
          },
          lessonFile: {
            select: {
              id: true,
              file: true,
              note: true
            }
          }
        }
      }
    )
    return {
      success: true,
      message: "Successfully Getted Lesson",
      data: all
    }
  }

  async findOne(id: string) {
    let one = await this.prismaService.lesson.findFirst(
      {
        where: {
          id: id
        },
        include:
        {
          lastActivity: {
            select: {
              userId: true
            }
          },
          lessonView: {
            select: {
              userId: true,
              view: true
            },
          },
          lessonFile: {
            select: {
              id: true,
              file: true,
              note: true
            }
          }
        }
      }
    )
    if (!one) throw new NotFoundException(`This ${id} is not found`)
    return {
      success: true,
      message: "Successfully Getted One Lesson",
      data: one
    }
  }

  async update(id: string, payload: UpdateLessonDto, video: Express.Multer.File) {
    let video_name = video.filename
    const existingLesson = await this.prismaService.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) throw new NotFoundException(`Lesson with ID ${id} not found`);

    const updated = await this.prismaService.lesson.update({
      where: { id },
      data: {
        ...payload,
        video: video_name
      }
    });

    if (existingLesson.video && video?.filename && existingLesson.video !== video.filename) {
      const oldPath = path.resolve('uploads/videos', existingLesson.video);
      deleteMovieFile(oldPath);
    }

    return {
      success: true,
      message: "Successfully Updated One Lesson",
      data: updated
    };

  }
  async turn_view(id: string, view: boolean) {
    let update = await this.prismaService.lessonView.update({
      where: {
        lessonId: id
      },
      data: { view: view }
    })
    if (!update) throw new NotFoundException(`Lesson with ID ${id} not found`)

    return {
      success: true,
      message: "Successfully View Update",
      data: update
    }
  }

  async remove(id: string) {
    let deleted = await this.prismaService.lesson.delete(
      {
        where: {
          id: id
        }
      }
    )
    if (!deleted) throw new NotFoundException(`Lesson with ID ${id} not found`)
  }
}
