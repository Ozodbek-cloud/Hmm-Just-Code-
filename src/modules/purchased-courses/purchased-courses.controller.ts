import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { CreatePurchasedCourseDto } from './dto/create-purchased-course.dto';
import { UpdatePurchasedCourseDto } from './dto/update-purchased-course.dto';

@Controller('purchased-courses')
export class PurchasedCoursesController {
  constructor(private readonly purchasedCoursesService: PurchasedCoursesService) {}

  @Post()
  create(@Body() createPurchasedCourseDto: CreatePurchasedCourseDto) {
    return this.purchasedCoursesService.create(createPurchasedCourseDto);
  }

  @Get()
  findAll() {
    return this.purchasedCoursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasedCoursesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchasedCourseDto: UpdatePurchasedCourseDto) {
    return this.purchasedCoursesService.update(+id, updatePurchasedCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasedCoursesService.remove(+id);
  }
}
