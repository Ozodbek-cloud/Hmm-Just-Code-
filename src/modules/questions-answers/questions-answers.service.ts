import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateQuestionAnswerDto, CreateQuestionsDto } from './interfaces/create-questions-answer.dto';
import { UpdateQuestionsAnswerDto } from './interfaces/update-questions-answer.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import path from 'path';
import { deleteMovieFile } from 'src/common/utils/delere-utils';
import { GetQuestionsAnswerQueryDto } from './interfaces/query-dto';

@Injectable()
export class QuestionsAnswersService {
  constructor(private prismaService: PrismaService) { }

  async findmine(query: GetQuestionsAnswerQueryDto) {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const offset = (page - 1) * limit;
      const where = query.courseId && query.read ? { courseId: query.courseId, read: query.read } : {};

      const total = await this.prismaService.question.count({ where });

      const data = await this.prismaService.question.findMany({
        where,
        skip: offset,
        take: limit,
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
              assignedCourses: {
                select: {
                  userId: true
                }
              }
            },

          },
          users: {
            select: {
              fullName: true,
              role: true
            }
          }

        }
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

  async find_courseId(query: GetQuestionsAnswerQueryDto) {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const offset = (page - 1) * limit;
      const where = query.courseId && query.read ? { courseId: query.courseId, read: query.read } : {};

      const total = await this.prismaService.question.count({ where });

      const data = await this.prismaService.question.findMany({
        where,
        skip: offset,
        take: limit,
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
              assignedCourses: {
                select: {
                  userId: true
                }
              }
            },

          },
          users: {
            select: {
              fullName: true,
              role: true
            }
          }

        }
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

  async findOne(id: number) {
    try {
      let find_one = await this.prismaService.question.findFirst({
        where: {
          id: id
        },
        include: {
          questionAnswer: {
            select: {
              questionId: true,
              userId: true,
              text: true,
              file: true
            }
          },
          users: {
            select: {
              fullName: true,
              image: true
            }
          },
          courses: {
            select: {
              name: true,
              about: true,
              banner: true,
              price: true,
              level: true,
              published: true
            }
          }
        }
      })
      if (!find_one) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: "Successfully Getted One Questiion",
        data: find_one
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async read(id: number) {
    try {
      let readat = Date.now()
      let readed = await this.prismaService.question.update({
        where: {
          id: id
        },
        data: {
          read: true,
          readAt: readat.toString()
        }
      })
      if (!readed) throw new NotFoundException(`This ${id} not found`)

      return {
        success: true,
        message: "Successfully Readed Question",
        data: readed
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
  async create_question(userId: number, courseId: string, payload: CreateQuestionsDto, file: Express.Multer.File) {
    try {
      let file_filename = file.filename
      let created = await this.prismaService.question.create({
        data: {
          ...payload,
          userId: userId,
          ...(file && { file: file_filename }),
          courseId: courseId
        }
      })
      if (!userId || !courseId) throw new NotFoundException("ID is not found")

      return {
        success: true,
        message: "Successfully Created Question",
        data: created
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update_question(id: number, payload: CreateQuestionsDto, file: Express.Multer.File) {
    try {
      let file_filename = file.filename
      let created = await this.prismaService.question.update({
        where: {
          id: id
        },
        data: {
          ...payload,
          ...(file && { file: file_filename }),
        }
      })
      if (!id) throw new NotFoundException("ID is not found")

      if (file && created.file && created.file !== file.filename) {
        const oldBannerPath = path.resolve('uploads/file', created.file);
        deleteMovieFile(oldBannerPath);
      }

      return {
        success: true,
        message: "Successfully Updated Question",
        data: created
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async create_question_answer(user_id: number, questionId: number, payload: CreateQuestionAnswerDto, file: Express.Multer.File) {
    try {
      let file_filename = file.filename
      let created_answer = await this.prismaService.questionAnswer.create({
        data: {
          userId: user_id,
          questionId: questionId,
          text: payload.text,
          ...(file && { file: file_filename }),
        }
      })
      if (!user_id || !questionId) throw new NotFoundException("ID is not found")
      return {
        success: true,
        message: "Successfully Created Question Answers",
        data: created_answer
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(id: number, payload: UpdateQuestionsAnswerDto, file: Express.Multer.File) {
    try {
      let file_filename = file.filename
      let updateat = new Date()
      let data = await this.prismaService.questionAnswer.update({
        where: {
          id: id
        },
        data: {
          ...payload,
          ...(file && { file: file_filename }),
          updatedAt: updateat
        }
      })
      if (!data) throw new NotFoundException(`This ${id} is not found`)

      if (file && data.file && data.file !== file.filename) {
        const oldBannerPath = path.resolve('uploads/file', data.file);
        deleteMovieFile(oldBannerPath);
      }

      return {
        success: true,
        message: "Successfully Updated Question Answer",
        data: data
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async question_remove(id: number) {
    try {
      let deleted = await this.prismaService.question.delete({
        where: {
          id: id
        }
      })
      if (!deleted) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: "Successfully Deleted Question",
        data: deleted
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async question_answer_remove(id: number) {
    try {
      let deleted = await this.prismaService.questionAnswer.delete({
        where: {
          id: id
        }
      })
      if (!deleted) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: "Successfully Deleted QuestionAnswer",
        data: deleted
      }
    }
    catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}