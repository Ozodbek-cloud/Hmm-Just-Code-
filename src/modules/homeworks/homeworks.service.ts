import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateHomeworkDto } from './interfaces/create-homework.dto';
import { UpdateHomeworkDto } from './interfaces/update-homework.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import path from 'path';
import { deleteMovieFile } from 'src/common/utils/delere-utils';
import { GetHomeworksQueryDto, GetSubmitQueryDto, GetSubmitsQueryDto } from './interfaces/query.dto';
import { CheckDto, SubmissionDto } from './interfaces/submission.dto';

@Injectable()
export class HomeworksService {
  constructor(private prismaService: PrismaService) { }

  async create(createHomeworkDto: CreateHomeworkDto, file: Express.Multer.File) {
    try {
      let filname = file.filename
      let created = await this.prismaService.homework.create({
        data: {
          ...createHomeworkDto,
          ...(file && { file: filname }),
        },
      })
      return {
        success: true,
        message: "Successfully Created Homework",
        data: created
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getLessonGroupsWithHomeworks(query: GetHomeworksQueryDto) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(id: number, updateHomeworkDto: UpdateHomeworkDto, file: Express.Multer.File) {
    try {
      let filename = ''
      if (file && file.originalname) {
        filename = file.filename;
      }
      let updateat = new Date()
      let updated = await this.prismaService.homework.update({
        where: {
          id: id
        },
        data: {
          ...updateHomeworkDto, file: filename,
          updatedAt: updateat
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async get_submits(query: GetSubmitsQueryDto) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async subit_submission(user_id: number, lessonId: string, payload: SubmissionDto) {
    try {
      let find_one = await this.prismaService.homework.findFirst({
        where: {
          lessonId: lessonId
        }
      })
      if (!find_one) throw new NotFoundException(`This ${lessonId} is not found`)
      let submit = await this.prismaService.homeworkSubmission.create({
        data: {
          file: payload.file,
          text: payload.text,
          homeworkId: find_one.id,
          userId: user_id
        }
      })

      return {
        success: true,
        message: "Successfully Sumbitted Homework",
        data: {
          lessonId: lessonId,
          userId: user_id,
          homeworkId: submit.homeworkId,
          file: submit.file,
          text: submit.text
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async get_submissions(query: GetSubmitQueryDto) {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const offset = (page - 1) * limit;
      const where = query.courseId ? { id: query.courseId } : {};

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
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async single(id: number) {
    try {
      let one = await this.prismaService.homeworkSubmission.findFirst({
        where: {
          id: id
        },
        include: {
          homeworks: {
            select: {
              task: true,
              file: true,
              lessonId: true
            }
          },
          users: {
            select: {
              fullName: true,
              phone: true,
              image: true
            }
          }
        },
      })
      if (!one) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: "Successfully Getted One Submission",
        data: one
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async check(submissionId: number, payload: CheckDto) {
    try {
      const { approved } = payload

      const updated = await this.prismaService.homeworkSubmission.update({
        where: { id: submissionId },
        data: {
          ...payload,
          status: approved ? 'APPROVED' : 'REJECTED',
        },
      });

      return {
        success: true,
        message: "Successfully Checked Submission",
        data: updated
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
