import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryRatingService } from './category-rating.service';
import { CreateRatingDto } from './interfaces/create-category-rating.dto';

@Controller('category-rating')
export class CategoryRatingController {
  constructor(private readonly categoryRatingService: CategoryRatingService) {}

  @Post()
  create(@Body() payload: CreateRatingDto) {
    return this.categoryRatingService.create(payload);
  }

  @Get()
  findAll() {
    return this.categoryRatingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryRatingService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryRatingService.remove(+id);
  }
}
