import { Controller, Post, Get, Param, Body, Patch, Delete, Put, Query } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryDto, UpdatedCourseCategoryDto } from './interfaces/course-category';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/core/decorators/decorators.service';

@ApiTags('Course Categories')
@Controller('course-categories')
export class CourseCategoryController {
  constructor(private readonly categoryService: CourseCategoryService) { }

  @Get()
  @ApiOperation({ summary: 'Get all course categories with related courses' })
  @ApiResponse({ status: 200, description: 'All course categories retrieved successfully.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async getAll(@Query() query: any,) {
    return await this.categoryService.get_all_course_category(query);
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get one course category by ID' })
  @ApiParam({ name: 'id', type: Number, description: "ID of course category" })
  @ApiResponse({ status: 200, description: 'Course category retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Course category not found.' })
  async getOne(@Param('id') id: number) {
    return await this.categoryService.get_one_course_category(+id);
  }


  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('create')
  @ApiOperation({ summary: 'Create a new course category | ADMIN' })
  @ApiResponse({ status: 201, description: 'Course category successfully created.' })
  async create(@Body() payload: CourseCategoryDto) {
    return await this.categoryService.create_category(payload);
  }

  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update a course category by ID | ADMIN' })
  @ApiResponse({ status: 200, description: 'Course category updated successfully.' })
  @ApiResponse({ status: 404, description: 'Course category not found.' })
  async update(
    @Param('id') id: number,
    @Body() payload: UpdatedCourseCategoryDto
  ) {
    return await this.categoryService.update_course_category(+id, payload);
  }

  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course category by ID | ADMIN' })
  @ApiResponse({ status: 200, description: 'Course category deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Course category not found.' })
  async delete(@Param('id') id: number) {
    return await this.categoryService.delete_course_category(+id);
  }
}
