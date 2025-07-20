import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto, CreateManyExamsDto } from './interfaces/create-exam.dto';
import { UpdateExamDto } from './interfaces/update-exam.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

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
  async find_by_details(lesson_group_id) {
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
}
