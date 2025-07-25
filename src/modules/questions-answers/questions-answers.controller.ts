import { Controller, Get, Post, Body, Param, Delete, Put, Query, UploadedFile, UseInterceptors, ParseIntPipe, Patch, Req, UnsupportedMediaTypeException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionsAnswersService } from './questions-answers.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateQuestionAnswerDto, CreateQuestionsDto } from './interfaces/create-questions-answer.dto';
import { UpdateQuestionsAnswerDto } from './interfaces/update-questions-answer.dto';
import { GetQuestionsAnswerQueryDto } from './interfaces/query-dto';
import { Auth } from 'src/core/decorators/decorators.service';
import { UserRole } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from "uuid"
@ApiTags('Questions & Answers')
@Controller('questions-answers')
export class QuestionsAnswersController {
  constructor(private readonly service: QuestionsAnswersService) { }

  @Get('mine')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my questions by courseId and read status | STUDENT' })
  findMine(@Query() query: GetQuestionsAnswerQueryDto) {
    return this.service.findmine(query);
  }

  @Get('by-course')
  @Auth(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get Courses With Query | MENTOR | ADMIN | ASSISTANT" })
  findCourse(@Query() query: GetQuestionsAnswerQueryDto) {
    return this.service.find_courseId(query);
  }

  @Get(':id/single')
  @Auth(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one question by ID | MENTOR | ADMIN | ASSISTANT' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post(':id/read')
  @Auth(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark question as read | MENTOR | ADMIN | ASSISTANT' })
  @ApiParam({ name: 'id' })
  read(@Param('id') id: number) {
    return this.service.read(id);
  }

  @Post(':courseId')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create question with file upload | STUDENT' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'courseId', type: String })
  @ApiBody({ type: CreateQuestionsDto })
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
  createQuestion(@Req() req: Request, @Param('courseId') courseId: string, @Body() body: CreateQuestionsDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.create_question(req['user'].id, courseId, body, file);
  }

  @Patch(':id/question')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update question | STUDENT' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number })
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
  updateQuestion(@Param('id', ParseIntPipe) id: number, @Body() body: CreateQuestionsDto, @UploadedFile() file: Express.Multer.File,) {
    return this.service.update_question(id, body, file);
  }

  @Post('answer/:questionId')
  @Auth(UserRole.ASSISTANT, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create question answer | ASSISTANT | MENTOR' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'questionId', type: Number })
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
  createAnswer(@Req() req: Request, @Param('questionId', ParseIntPipe) questionId: number, @Body() body: CreateQuestionAnswerDto, @UploadedFile() file: Express.Multer.File,) {
    return this.service.create_question_answer(req['user'].id, questionId, body, file);
  }

  @Patch('answer/:id')
  @Auth(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update question answer | MENTOR | ADMIN | ASSISTANT' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number })
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
  updateAnswer(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateQuestionsAnswerDto, @UploadedFile() file: Express.Multer.File,) {
    return this.service.update(id, body, file);
  }

  @Delete(':id/delete')
  @Auth(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete question by ID | MENTOR | ADMIN | ASSISTANT' })
  @ApiParam({ name: 'id', type: Number })
  deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.service.question_remove(id);
  }

  @Delete('answer/:id')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete question answer by ID STUDENT' })
  @ApiParam({ name: 'id', type: Number })
  deleteAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.service.question_answer_remove(id);
  }
}
