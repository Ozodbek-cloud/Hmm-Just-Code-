import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionAnswerDto, CreateQuestionsDto } from './dto/create-questions-answer.dto';
import { UpdateQuestionsAnswerDto } from './dto/update-questions-answer.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class QuestionsAnswersService {
  constructor(private prismaService: PrismaService) { }

  async findAll() {
    return `This action returns all questionsAnswers`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} questionsAnswer`;
  }

  async read(id: number) {
    let readed = await this.prismaService.question.update({
      where: {
        id: id
      },
      data: {
        read: true
      }
    })
    if (!readed) throw new NotFoundException(`This ${id} not found`)

    return {
      success: true,
      message: "Successfully Readed Question",
      data: readed
    }
  }
  async create_question(userId: number, courseId: string, payload: CreateQuestionsDto, file: Express.Multer.File) {
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
  }

  async update_question(id: number, payload: CreateQuestionsDto, file: Express.Multer.File) {
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

    return {
      success: true,
      message: "Successfully Updated Question",
      data: created
    }
  }

  async create_question_answer(user_id: number, questionId: number, payload: CreateQuestionAnswerDto, file: Express.Multer.File) {
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
  }

  async update(id: number, payload: UpdateQuestionsAnswerDto, file: Express.Multer.File) {
    let file_filename = file.filename
    let data = await this.prismaService.questionAnswer.update({
      where: {
        id: id
      },
      data: {
        ...payload,
        ...(file && { file: file_filename })
      }
    })
    if (!data) throw new NotFoundException(`This ${id} is not found`)

    return {
      success: true,
      message: "Successfully Updated Question Answer",
      data: data
    }
  }

  async question_remove(id: number) {
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
  }

  async question_answer_remove(id: number) {
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
}
