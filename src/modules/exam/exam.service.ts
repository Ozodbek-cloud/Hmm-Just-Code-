import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto, CreateManyExamsDto } from './interfaces/create-exam.dto';
import { UpdateExamDto } from './interfaces/update-exam.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PassExamDto } from './interfaces/pass-the-exam.dto';
import { ExamAnswer } from '@prisma/client';

export interface ExamQuestionResult {
  questionId: number
  userAnswer: ExamAnswer
  correctAnswer: ExamAnswer
  isCorrect: boolean
}

export interface PassExamResult {
  success: boolean
  score: number
  correctAnswers: number
  uncorrectAnswers: number
  totalQuestions: number
  passed: boolean
  results: ExamQuestionResult[]
}

@Injectable()
export class ExamService {
  constructor(private prismaService: PrismaService) { }

  async create(payload: CreateExamDto) {
    let created = await this.prismaService.exam.create({
      data: payload
    })
    return {
      success: true,
      message: "Successfully Created Exam",
      data: created
    }
  }

  async createMany(createManyExamsDto: CreateManyExamsDto) {
    const { lessonGroupId, exams } = createManyExamsDto

    const lessonGroup = await this.prismaService.lessonGroup.findUnique({
      where: { id: lessonGroupId },
    })

    if (!lessonGroup) throw new NotFoundException(` This ${lessonGroupId} is not foound`)


    const examData = exams.map((exam) => ({
      ...exam,
      lessonGroupId,
    }))

    const result = await this.prismaService.exam.createMany({
      data: examData,
      skipDuplicates: true,
    })

    return {
      success: true,
      count: result.count,
      message: `${result.count} Created`,
    }
  }

  async passExam(passExamDto: PassExamDto, userId: number): Promise<PassExamResult> {
    const { lessonGroupId, answers } = passExamDto

    const lessonGroup = await this.prismaService.lessonGroup.findUnique({
      where: { id: lessonGroupId },
    })

    if (!lessonGroup) throw new NotFoundException("Lesson group not found")


    const examQuestions = await this.prismaService.exam.findMany({
      where: { lessonGroupId },
    })

    if (examQuestions.length === 0) throw new NotFoundException("No exam questions found for this lesson group")

    let correctAnswers = 0
    let uncorrectAnswers = 0
    const results: ExamQuestionResult[] = []

    for (const answer of answers) {
      const question = examQuestions.find((q) => q.id === answer.id)

      if (!question) throw new BadRequestException(`Question with id ${answer.id} not found`)


      const isCorrect = question.answer === answer.answer
      if (isCorrect) {
        correctAnswers++
      } else {
        uncorrectAnswers++
      }

      results.push({
        questionId: answer.id,
        userAnswer: (answer.answer) as ExamAnswer,
        correctAnswer: question.answer,
        isCorrect,
      })
    }

    const totalQuestions = examQuestions.length
    const wrongAnswers = totalQuestions - correctAnswers
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= 70

    await this.prismaService.examResult.create({
      data: {
        userId,
        lessonGroupId,
        corrects: correctAnswers,
        wrongs: wrongAnswers,
        passed,
      },
    })

    return {
      success: true,
      score,
      correctAnswers,
      uncorrectAnswers,
      totalQuestions,
      passed,
      results,
    }
  }

  async findAll() {
    let all = await this.prismaService.exam.findMany({
      include: {
        lessonGroup: {
          select: {
            id: true,
            name: true,
            courseId: true,
          }
        }
      }
    })
    let count = await this.prismaService.exam.count()
    return {
      success: true,
      message: "Successfully Getted All Exam",
      data: all,
      total: count
    }
  }

  async findOne(lessonGroupId: number) {
    let find_lesson_group = await this.prismaService.exam.findFirst({
      where: {
        lessonGroupId: lessonGroupId
      }
    })
    if (!find_lesson_group) throw new NotFoundException(`This ${lessonGroupId} is not found`)

    return {
      success: true,
      message: "Successfully Getted By LessonGroupId",
      data: find_lesson_group
    }

  }
  async find_by_details(lesson_group_id: number) {
    let detail = await this.prismaService.exam.findFirst({
      where: {
        lessonGroupId: lesson_group_id
      },
      include: {
        lessonGroup: {
          select: {
            id: true,
            name: true,
            courseId: true
          }
        }
      }
    })
    if (!detail) throw new NotFoundException(`This ${lesson_group_id} is not found`)

    return {
      success: true,
      message: "Successfully Getted Details of LessonGroup",
      data: detail
    }
  }
  async get_detail_of_exam(id: number) {
    let find_detail = await this.prismaService.exam.findFirst({
      where: {
        id: id
      },
      include: {
        lessonGroup: {
          select: {
            id: true,
            name: true,
            courseId: true
          }
        }
      }
    })
    if (!find_detail) throw new NotFoundException(`This ${id} is not found`)

    return {
      success: true,
      message: "Successfully Getted Details Of Exam Questions",
      data: find_detail
    }
  }


  async update(id: number, payload: UpdateExamDto) {
    let updated = await this.prismaService.exam.update({
      where: {
        id: id
      },
      data: payload
    })
    if (!updated) throw new NotFoundException(`This ${id} id not found`)

    return {
      success: true,
      message: "Successfully Updated Exam Questions",
      data: updated
    }
  }

  async remove(id: number) {
    let deleted = await this.prismaService.exam.delete({
      where: {
        id: id
      }
    })
    if (!deleted) throw new NotFoundException(`This ${id} id not found`)

    return {
      success: true,
      message: "Successfully Deleted Exam Questions",
      data: deleted
    }
  }
  async get_exam_results(lessonGroupId: number, userId: number, query: any) {
    const limit = parseInt(query.limit) || 10;
    const offset = parseInt(query.offset) || 0;

    const filters: any = {
      lessonGroupId,
      userId,
    };

    if (query.passed !== undefined) {
      filters.passed = query.passed === 'true';
    }

    if (query.date_from || query.date_to) {
      filters.createdAt = {};
      if (query.date_from) {
        filters.createdAt.gte = new Date(query.date_from);
      }
      if (query.date_to) {
        filters.createdAt.lte = new Date(query.date_to);
      }
    }

    const total = await this.prismaService.examResult.count({
      where: filters,
    });

    const totalPages = Math.ceil(total / limit);

    const data = await this.prismaService.examResult.findMany({
      where: filters,
      skip: offset,
      take: limit,
    });

    return {
      success: true,
      message: "Exam results fetched successfully",
      data,
      pagination: {
        total,
        limit,
        offset,
        pages: totalPages,
      },
    };
  }

  async get_exam_results_for_mentor(lessonGroupId: number, userId: number, query: any) {
    const limit = parseInt(query.limit) || 10;
    const offset = parseInt(query.offset) || 0;

    const filters: any = {
      lessonGroupId,
      userId,
    };

    if (query.passed !== undefined) {
      filters.passed = query.passed === 'true';
    }

    if (query.date_from || query.date_to) {
      filters.createdAt = {};
      if (query.date_from) {
        filters.createdAt.gte = new Date(query.date_from);
      }
      if (query.date_to) {
        filters.createdAt.lte = new Date(query.date_to);
      }
    }

    const total = await this.prismaService.examResult.count({
      where: filters,
    });

    const totalPages = Math.ceil(total / limit);

    const data = await this.prismaService.examResult.findMany({
      where: filters,
      skip: offset,
      take: limit,
    });

    return {
      success: true,
      message: "Exam results fetched successfully",
      data,
      pagination: {
        total,
        limit,
        offset,
        pages: totalPages,
      },
    };
  }


}
