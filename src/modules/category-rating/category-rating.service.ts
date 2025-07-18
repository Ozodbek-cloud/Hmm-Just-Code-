import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './interfaces/create-category-rating.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CategoryRatingService {
  constructor(private prismaService: PrismaService) { }


  async create(payload: CreateRatingDto) {
    let created = await this.prismaService.rating.create({ data: payload })
    return {
      success: true,
      message: "Successfully Created Rating",
      data: created
    }
  }

  async findAll() {
    let all = await this.prismaService.rating.findMany()
    return {
      success: true,
      message: "Successfully Getted All Rating",
      data: all
    }
  }

  async findOne(id: number) {
    let one = await this.prismaService.rating.findFirst({
      where: {
        id: id
      }
    })
    if (!one) throw new NotFoundException(`This ${id} is not found `)
    return {
      success: true,
      message: "Successfully Getted One Rating",
      data: one
    }
  }

  async remove(id: number) {
    let one = await this.prismaService.rating.delete({
      where: {
        id: id
      }
    })
    if (!one) throw new NotFoundException(`This ${id} is not found `)

    return {
      success: true,
      message: "Successfully Deleted One Rating",
      data: one
    }
  }
}
