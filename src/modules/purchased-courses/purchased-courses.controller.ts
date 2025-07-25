import { Controller, Post, Get, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PurchasedCoursesService } from './purchased-courses.service';
import { CreatePurchasedCourseDto } from './dto/create-purchased-course.dto';

@ApiTags('Purchased Courses')
@Controller('purchased-courses')
export class PurchasedCoursesController {
  constructor(private readonly purchasedCoursesService: PurchasedCoursesService) {}

  @Post('purchase/:courseId/:userId')
  @ApiOperation({ summary: 'Purchase a course by courseId and userId' })
  @ApiResponse({ status: 201, description: 'Course successfully purchased' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async purchaseCourse(
    @Param('courseId') courseId: string,
    @Param('userId') userId: number
  ) {
    return this.purchasedCoursesService.purchaseCourse(courseId, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Purchase course using phone number ' })
  @ApiResponse({ status: 201, description: 'Course purchased ' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async createPurchasedCourse(@Body() payload: CreatePurchasedCourseDto) {
    return this.purchasedCoursesService.createPurchasedCourse(payload);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all purchased courses of a user' })
  // @ApiResponse({ status: 200, description: 'All purchased courses returned' })
  // async getAll(
  //   @Query('userId') userId: number,
  //   @Query() query: GetCoursesQueryDto
  // ) {
  //   return this.purchasedCoursesService.getAll(userId, query);
  // }

  @Get(':courseId/:userId')
  @ApiOperation({ summary: 'Get one purchased course by courseId and userId' })
  @ApiResponse({ status: 200, description: 'Purchased course returned' })
  @ApiResponse({ status: 404, description: 'Purchased course not found' })
  async getOne(
    @Param('courseId') courseId: string,
    @Param('userId') userId: number
  ) {
    return this.purchasedCoursesService.getOne(courseId, userId);
  }
}
