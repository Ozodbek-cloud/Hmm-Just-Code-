import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LessonGroupsService } from './lesson-groups.service';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson-group.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('lesson-groups')
export class LessonGroupsController {
  constructor(private readonly lessonGroupsService: LessonGroupsService) { }

  @Post()
  create(@Body() createLessonGroupDto: CreateLessonGroupDto) {
    return this.lessonGroupsService.create(createLessonGroupDto);
  }

  @Get('all/:course_id')
  @ApiOperation({ summary: 'Berilgan course bo‘yicha lesson group larni olish (limit, offset, lessons qo‘shish opsiyasi bilan)' })
  @ApiResponse({ status: 200, description: 'OK' })
  findAllByCourseId(
    @Param('course_id') courseId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('include_lessons') includeLessons?: string,
  ) {
    return this.lessonGroupsService.findAllByCourseId(courseId, { offset, limit, include_lessons: includeLessons });
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonGroupDto: UpdateLessonGroupDto) {
    return this.lessonGroupsService.update(+id, updateLessonGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonGroupsService.remove(+id);
  }
}
