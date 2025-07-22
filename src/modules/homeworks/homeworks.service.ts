import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import path from 'path';
import { deleteMovieFile } from 'src/common/utils/delere-utils';
import { GetHomeworksQueryDto, GetSubmitsQueryDto } from './dto/query.dto';

@Injectable()
export class HomeworksService {
  constructor(private prismaService: PrismaService) { }


  async create(createHomeworkDto: CreateHomeworkDto, file: Express.Multer.File) {
    let filname = file?.filename
    let created = await this.prismaService.homework.create({
      data: {
        ...createHomeworkDto,
        ...(file && { file: file.filename }),
      },
    })
    return {
      success: true,
      message: "Successfully Created Homework",
      data: created
    }
  }

  async getLessonGroupsWithHomeworks(query: GetHomeworksQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = query.courseId ? { courseId: query.courseId } : {};

    const total = await this.prismaService.lessonGroup.count({ where });

    const data = await this.prismaService.lessonGroup.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        lessons: {
          select: {
            name: true,
            about: true,
            video: true,
            homework: {
              select: {
                id: true,
                task: true,
                file: true,
                lessonId: true,
                homeworkSubmission: {
                  select: {
                    text: true,
                    file: true,
                    reason: true,
                    status: true,
                    homeworkId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: `Successfully retrieved homeworks${query.courseId ? ` for course ${query.courseId}` : ''}`,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }



  async findOne(id: number) {
    let find_one = await this.prismaService.homework.findFirst({
      where: {
        id: id
      },
      include: {
        lessons: {
          select: {
            name: true,
            about: true,
            video: true
          }
        },
        homeworkSubmission: {
          select: {
            text: true,
            file: true,
            reason: true,
            status: true,
            homeworkId: true,
            userId: true
          }
        }
      }
    })
    if (!find_one) throw new NotFoundException(`This ${id} is not found`)

    return {
      success: true,
      message: "Successfully Getted One Homework",
      data: find_one
    }
  }

  async update(id: number, updateHomeworkDto: UpdateHomeworkDto, file: Express.Multer.File) {
    let filename = ''
    if (file && file.originalname) {
      filename = file.filename;
    }
    let updated = await this.prismaService.homework.update({
      where: {
        id: id
      },
      data: {
        ...updateHomeworkDto, file: filename
      },
    })
    if (file && updated.file && updated.file !== file.filename) {
      const oldBannerPath = path.resolve('uploads/file', updated.file);
      deleteMovieFile(oldBannerPath);
    }
    return {
      success: true,
      message: "Successfully Updated Homework",
      data: updated
    }
  }

  async remove(id: number) {
    let deleted_one = await this.prismaService.homework.delete({
      where: {
        id: id
      }
    })
    if (!deleted_one) throw new NotFoundException(`This ${deleted_one} is not found`)

    return {
      sucess: true,
      message: "Successfully Deleted Homework",
      data: deleted_one
    }
  }

  async get_submits(query: GetSubmitsQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;
    const where = query.lessonId ? { id: query.lessonId } : {}; 

    const total = await this.prismaService.lesson.count({ where });

    const data = await this.prismaService.lesson.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        homework: {
          select: {
            id: true,
            task: true,
            file: true,
            lessonId: true,
            homeworkSubmission: {
              select: {
                text: true,
                file: true,
                reason: true,
                status: true,
                homeworkId: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: `Successfully fetched submissions`,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
  

}


