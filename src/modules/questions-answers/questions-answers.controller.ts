import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, Req } from '@nestjs/common';
import { QuestionsAnswersService } from './questions-answers.service';
import { UpdateQuestionsAnswerDto } from './dto/update-questions-answer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {v4 as uuidv4} from "uuid"
import { extname } from 'path';
import { CreateQuestionsDto } from './dto/create-questions-answer.dto';

@Controller('questions-answers')
export class QuestionsAnswersController {
  constructor(private readonly questionsAnswersService: QuestionsAnswersService) { }

  @Post()
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
  create(@Body() createQuestionsAnswerDto: CreateQuestionsDto,@Req() req: Request, @Param('courseId')  courseId: string, file : Express.Multer.File) {
    return this.questionsAnswersService.create_question(req['user'].id, courseId, createQuestionsAnswerDto, file);
  }

  @Get()
  findAll() {
    return this.questionsAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsAnswersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateQuestionsAnswerDto: UpdateQuestionsAnswerDto) {
  //   return this.questionsAnswersService.update(+id, updateQuestionsAnswerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.questionsAnswersService.remove(+id);
  // }
}
