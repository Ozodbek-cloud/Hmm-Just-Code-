import { Controller, Get, Post, Body, Patch, Param, Delete, Query, } from '@nestjs/common';
import { LessonGroupsService } from './lesson-groups.service';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson-group.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery, ApiBody, ApiBearerAuth, } from '@nestjs/swagger';
import { Auth } from 'src/core/decorators/decorators.service';
import { UserRole } from '@prisma/client';

@ApiTags('Lesson Groups')
@Controller('lesson-groups')
export class LessonGroupsController {
  constructor(private readonly lessonGroupsService: LessonGroupsService) { }
  @Get('all/:course_id')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lesson groups by course ID (with optional pagination and lessons inclusion) | STUDENT' })
  @ApiParam({ name: 'course_id', type: String, description: 'ID of the course' })
  @ApiQuery({ name: 'offset', required: false, type: String, description: 'Number of records to skip' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Maximum number of records to return' })
  @ApiQuery({
    name: 'include_lessons', required: false, schema: { type: 'boolean', enum: [true, false] },
    description: 'Include lessons inside each group (true/false)',
  }) @ApiResponse({ status: 200, description: 'Lesson groups retrieved successfully' })
  findAllByCourseId(
    @Param('course_id') courseId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('include_lessons') includeLessons?: string,

  ) {
    return this.lessonGroupsService.findAllByCourseId(courseId, {
      offset,
      limit,
      include_lessons: includeLessons,
    });
  }

  @Get(':id/details')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single lesson group by ID | ADMIN ' })
  @ApiParam({ name: 'id', type: String, description: 'Lesson Group ID' })
  @ApiResponse({ status: 200, description: 'Lesson group found' })
  @ApiResponse({ status: 404, description: 'Lesson group not found' })
  findOne(@Param('id') id: number) {
    return this.lessonGroupsService.findOne(id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get All Lesson Groups' })
  @ApiResponse({ status: 200, description: 'Lesson group found' })
  @ApiResponse({ status: 404, description: 'Lesson group not found' })
  findAll() {
    return this.lessonGroupsService.get_all();
  }

  @Post('create')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new lesson group | ADMIN | MENTOR' })
  @ApiResponse({ status: 201, description: 'Lesson group successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input or creation failed' })
  create(@Body() createLessonGroupDto: CreateLessonGroupDto) {
    return this.lessonGroupsService.create(createLessonGroupDto);
  }

  @Patch(':id/update')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a lesson group by ID | ADMIN | MENTOR' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the lesson group to update' })
  @ApiResponse({ status: 200, description: 'Lesson group updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson group not found' })
  update(@Param('id') id: number, @Body() updateLessonGroupDto: UpdateLessonGroupDto) {
    return this.lessonGroupsService.update(id, updateLessonGroupDto);
  }

  @Delete(':id/delete')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a lesson group by ID | ADMIN | MENTOR' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the lesson group to delete' })
  @ApiResponse({ status: 200, description: 'Lesson group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson group not found' })
  remove(@Param('id') id: number) {
    return this.lessonGroupsService.remove(id);
  }
}
