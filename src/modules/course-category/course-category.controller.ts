import { Controller, Post, Get,  Param, Body, Patch, Delete, Put} from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryDto, UpdatedCourseCategoryDto } from './interfaces/course-category';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Course Categories')
@Controller('course-categories')
export class CourseCategoryController {
  constructor(private readonly categoryService: CourseCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all course categories with related courses' })
  @ApiResponse({ status: 200, description: 'All course categories retrieved successfully.' })
  async getAll() {
    return await this.categoryService.get_all_course_category();
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get one course category by ID' })
  @ApiParam({name: 'id', type: Number, description: "ID of course category"})
  @ApiResponse({ status: 200, description: 'Course category retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Course category not found.' })
  async getOne(@Param('id') id: number) {
    return await this.categoryService.get_one_course_category(+id);
  }


  @Post('create')
  @ApiOperation({ summary: 'Create a new course category' })
  @ApiResponse({ status: 201, description: 'Course category successfully created.' })
  async create(@Body() payload: CourseCategoryDto) {
    return await this.categoryService.create_category(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a course category by ID' })
  @ApiResponse({ status: 200, description: 'Course category updated successfully.' })
  @ApiResponse({ status: 404, description: 'Course category not found.' })
  async update(
    @Param('id') id: number,
    @Body() payload: UpdatedCourseCategoryDto
  ) {
    return await this.categoryService.update_course_category(+id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course category by ID' })
  @ApiResponse({ status: 200, description: 'Course category deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Course category not found.' })
  async delete(@Param('id') id: number) {
    return await this.categoryService.delete_course_category(+id);
  }
}
