import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: CreateCourseDto, banner: Express.Multer.File, introVideo: Express.Multer.File) {
    let banner_filename = banner.filename
    let introVideo_filename = introVideo.filename
    let created = await this.prismaService.course.create({
      data: {
        ...payload,
          banner: banner_filename,
          introVideo: introVideo_filename
      }
    })
    return {
      success: true,
      message: "Successfully Created Course",
      data: created
    }
  }

  async findAll() {
    return await this.prismaService.course.findMany()
  }

  async findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  async remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
