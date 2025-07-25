import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFile, Query, Req } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './interfaces/create-homework.dto';
import { UpdateHomeworkDto } from './interfaces/update-homework.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from "uuid"
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetHomeworksQueryDto, GetSubmitsQueryDto } from './interfaces/query.dto';
import { CheckDto, SubmissionDto } from './interfaces/submission.dto';
import { Auth } from 'src/core/decorators/decorators.service';
import { UserRole } from '@prisma/client';
@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) { }

  @Post('add')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create Homework | ADMIN | MENTOR" })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/file',
        filename: (req, file, cb) => {
          const fileName = uuidv4() + extname(file.originalname);
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowed = [
          'application/pdf',
          'application/zip',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
        ];
        if (!allowed.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException('Only PDF, DOCX, ZIP, XLSX, TXT types are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  create(@Body() createHomeworkDto: CreateHomeworkDto, @UploadedFile() file: Express.Multer.File) {
    return this.homeworksService.create(createHomeworkDto, file);
  }

  @Get('all')
  @Auth(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @ApiOperation({ summary: "Get ALL Homework WIth COurse Id| ADMIN | MENTOR | ASSISTANT" })
  @ApiBearerAuth()
  findAll(@Query() query: GetHomeworksQueryDto) {
    return this.homeworksService.getLessonGroupsWithHomeworks(query);
  }

  @Get(':id/detail')
  @Auth(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get All Detail Id| ADMIN | MENTOR | ASSISTANT" })
  findOne(@Param('id') id: string) {
    return this.homeworksService.findOne(+id);
  }

  @Patch(':id/update/homework')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update Homework | ADMIN | MENTOR" })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/file',
        filename: (req, file, cb) => {
          const fileName = uuidv4() + extname(file.originalname);
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowed = [
          'application/pdf',
          'application/zip',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
        ];
        if (!allowed.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException('Only PDF, DOCX, ZIP, XLSX, TXT types are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  update(@Param('id') id: string, @Body() updateHomeworkDto: UpdateHomeworkDto, file: Express.Multer.File) {
    return this.homeworksService.update(+id, updateHomeworkDto, file);
  }

  @Delete(':id/delete')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete Homework | ADMIN | MENTOR" })
  remove(@Param('id') id: string) {
    return this.homeworksService.remove(+id);
  }

  @Get('submission/mine/:lessonId')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my homework submission by lessonId | STUDENT' })
  @ApiParam({ name: 'lessonId', type: String })
  @ApiResponse({ status: 200, description: 'Successfully fetched submission' })
  getMySubmission(@Query() query: GetSubmitsQueryDto) {
    return this.homeworksService.get_submissions(query);
  }

  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @Post('submission/submit/:lessonId')
  @ApiOperation({ summary: 'Submit homework for a lesson | STUDENT' })
  @ApiParam({ name: 'lessonId', type: String })
  @ApiResponse({ status: 201, description: 'Homework submitted successfully' })
  submitHomework(@Param('lessonId') lessonId: string, @Body() payload: SubmissionDto, @Req() req: Request) {
    return this.homeworksService.subit_submission(req['user'].id, lessonId, payload);
  }

  @Get('submissions/all')
  @Auth(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all submissions | Mentor, |  Admin, | Assistant' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'lessonId', required: false })
  @ApiResponse({ status: 200, description: 'All submissions fetched successfully' })
  getAllSubmissions(@Query() query: GetSubmitsQueryDto) {
    return this.homeworksService.get_submits(query);
  }

  @Get('submissions/single/:id')
  @Auth(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single submission by ID | Mentor Admin| Assistant' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Single submission returned successfully' })
  getSingleSubmission(@Param('id') id: string) {
    return this.homeworksService.single(+id);
  }

  @Post('submission/check')
  @Auth(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check/Approve/Reject a submission | Mentor | Admin | Assistant' })
  @ApiQuery({ name: 'submissionId', type: Number })
  @ApiResponse({ status: 200, description: 'Submission checked successfully' })
  checkSubmission(@Query('submissionId') submissionId: string, @Body() payload: CheckDto) {
    return this.homeworksService.check(+submissionId, payload);
  }

}
