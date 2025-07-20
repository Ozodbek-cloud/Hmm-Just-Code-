import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonFileDto } from './dto/create-lesson-file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson-file.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class LessonFileService {
  constructor(private prismaService: PrismaService) { }

  async create(payload: CreateLessonFileDto, file: Express.Multer.File) {
    let Filename = file.filename
    let created = await this.prismaService.lessonFile.create({
      data: {...payload, file: Filename}
    })
    return {
      success: true,
      message: "Successfully Created Lesson File",
      data: created
    }
  }

  async  findAll() {
    let all = await this.prismaService.lessonFile.findMany()
    return {
      success: true,
      message: "Successfully Getted All Lesson File",
      data: all
    }
  }

  async findOne(id: number) {
    let find_one = await this.prismaService.lessonFile.findFirst({
      where: {
        id: id
      }
    })
    if(!id) throw new NotFoundException(`This ${id} not found`)

    return {
      success: true,
      message: "Successfully Getted One LessonFile",
      data: find_one
    }
  }

  async update(id: number, payload: UpdateLessonFileDto) {
    let updated = await this.prismaService.lessonFile.update({
      where: {
        id: id
      },
      data: payload
    })
    if(!updated) throw new NotFoundException(`This ${id} is not Found`)

    return {
      success: true,
      message: "Successfully Updated Lesson File",
      data: updated
    }
  }

  async remove(id: number) {
   let deleted_one = await this.prismaService.lessonFile.delete({
     where: {
      id: id
     }
   })
   if (!deleted_one) throw new NotFoundException(`This ${id} is Not Found`)

  return {
    success: true,
    message: "SuccessFully Deleted Lesson File",
    data: deleted_one
  }
  }
}
