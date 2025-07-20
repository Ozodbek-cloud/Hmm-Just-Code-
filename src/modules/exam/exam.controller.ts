import { Controller, Get, Post, Body, Patch, Param, Delete, Query, } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto, CreateManyExamsDto } from './interfaces/create-exam.dto';
import { UpdateExamDto } from './interfaces/update-exam.dto';
import { PassExamDto } from './interfaces/pass-the-exam.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Exam')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @Post()
  @ApiOperation({ summary: 'Create one exam' })
  @ApiResponse({ status: 201, description: 'Exam successfully created' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create many exams' })
  @ApiResponse({ status: 201, description: 'Exams successfully created' })
  createMany(@Body() createManyExamsDto: CreateManyExamsDto) {
    return this.examService.createMany(createManyExamsDto);
  }

  @Post('pass/:userId')
  @ApiOperation({ summary: 'Pass an exam by user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Exam result' })
  PassExam(@Param('userId') userId: number, @Body() dto: PassExamDto) {
    return this.examService.passExam(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'List of all exams' })
  findAll() {
    return this.examService.findAll();
  }

  @Get('lesson-group/:lessonGroupId')
  @ApiOperation({ summary: 'Get exams by lesson group ID' })
  @ApiParam({ name: 'lessonGroupId', type: Number })
  @ApiResponse({ status: 200, description: 'Exam found by lesson group' })
  findOne(@Param('lessonGroupId') lessonGroupId: number) {
    return this.examService.findOne(lessonGroupId);
  }

  @Get('detail-by-lesson-group/:lessonGroupId')
  @ApiOperation({ summary: 'Get exam details by lesson group ID' })
  @ApiParam({ name: 'lessonGroupId', type: Number })
  @ApiResponse({ status: 200, description: 'Exam with lesson group details' })
  findByDetails(@Param('lessonGroupId') lessonGroupId: number) {
    return this.examService.find_by_details(lessonGroupId);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Get exam detail by exam ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Exam detail by ID' })
  getDetailOfExam(@Param('id') id: number) {
    return this.examService.get_detail_of_exam(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Exam successfully updated' })
  update(@Param('id') id: number, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(id, updateExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Exam successfully deleted' })
  remove(@Param('id') id: number) {
    return this.examService.remove(id);
  }

  @Get('results')
  @ApiOperation({ summary: 'Get exam results with filters and pagination' })
  @ApiQuery({ name: 'date_from', required: false, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'date_to', required: false, type: String, example: '2024-12-31' })
  @ApiQuery({ name: 'offset', required: false, type: String, example: '0' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '8' })
  @ApiQuery({ name: 'lesson_group_id', required: true, type: String })
  @ApiQuery({ name: 'user_id', required: true, type: String })
  @ApiQuery({ name: 'passed', required: false, enum: ['true', 'false'], example: 'false', type: String })
  async getResults(
    @Query('lesson_group_id') lessonGroupId: number,
    @Query('user_id') userId: number,
    @Query() query: any,
  ) {
    return this.examService.get_exam_results(+lessonGroupId, +userId, query);
  }
}
