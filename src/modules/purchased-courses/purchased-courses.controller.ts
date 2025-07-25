import { Controller, Post, Get, Param, Query, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PurchasedCoursesService } from './purchased-courses.service';
import { CreatePurchasedCourseDto } from './interfaces/create-purchased-course.dto';
import { GetCourseAndStudentQueryDto, GetPurchasedQueryDto } from './interfaces/query-dto';
import { Auth } from 'src/core/decorators/decorators.service';
import { UserRole } from '@prisma/client';

@ApiTags('Purchased Courses')
@Controller('purchased-courses')
export class PurchasedCoursesController {
  constructor(private readonly purchasedCoursesService: PurchasedCoursesService) { }

  @Get('mine')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all purchased courses for current user | STUDENT' })
  @ApiResponse({ status: 200, description: 'Purchased courses fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAll(
    @Query() query: GetPurchasedQueryDto,
    @Req() req: Request
  ) {
    return this.purchasedCoursesService.getAll(req['user'].id, query);
  }

  @Get('course-to-student')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get courses to student by filters | ADMIN | MENTOR' })
  @ApiResponse({ status: 200, description: 'Courses fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getCourseToStudent(@Query() query: GetCourseAndStudentQueryDto) {
    return this.purchasedCoursesService.getCourse_To_Student(query);
  }

  @Post('purchase/:courseId')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase a course by courseId | STUDENT' })
  @ApiResponse({ status: 201, description: 'Course successfully purchased' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async purchaseCourse(
    @Param('courseId') courseId: string,
    @Req() req: Request
  ) {
    return this.purchasedCoursesService.purchaseCourse(courseId, req['user'].id);
  }

  @Post('create')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase course using phone number | ADMIN' })
  @ApiResponse({ status: 201, description: 'Course purchased ' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async createPurchasedCourse(@Body() payload: CreatePurchasedCourseDto) {
    return this.purchasedCoursesService.createPurchasedCourse(payload);
  }

  @Get('mine/:courseId')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one purchased course by courseId and userId | STUDENT' })
  @ApiResponse({ status: 200, description: 'Purchased course returned' })
  @ApiResponse({ status: 404, description: 'Purchased course not found' })
  async getOne(
    @Param('courseId') courseId: string,
    @Req() req: Request
  ) {
    return this.purchasedCoursesService.getOne(courseId, req['user'].id);
  }
}
