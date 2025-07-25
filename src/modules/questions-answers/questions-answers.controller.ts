import {  Controller,  Get,  Post,  Body,  Param,  Delete,  Put,  Query,  UploadedFile,  UseInterceptors,  ParseIntPipe, Patch, Req,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionsAnswersService } from './questions-answers.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateQuestionAnswerDto, CreateQuestionsDto } from './dto/create-questions-answer.dto';
import { UpdateQuestionsAnswerDto } from './dto/update-questions-answer.dto';
import { GetQuestionsAnswerQueryDto } from './dto/query-dto';

@ApiTags('Questions & Answers')
@Controller('questions-answers')
export class QuestionsAnswersController {
  constructor(private readonly service: QuestionsAnswersService) {}

  @Get('mine')
  @ApiOperation({ summary: 'Get my questions by courseId and read status' })
  findMine(@Query() query: GetQuestionsAnswerQueryDto) {
    return this.service.findmine(query);
  }

  @Get('by-course')
  findCourse(@Query() query: GetQuestionsAnswerQueryDto) {
    return this.service.find_courseId(query);
  }

  @Get(':id/single')
  @ApiOperation({ summary: 'Get one question by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark question as read' })
  @ApiParam({ name: 'id'})
  read(@Param('id') id: number) {
    return this.service.read(id);
  }

  @Post(':courseId')
  @ApiOperation({ summary: 'Create question with file upload' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'courseId', type: String })
  @ApiBody({type: CreateQuestionsDto})
  @UseInterceptors(FileInterceptor('file'))
  createQuestion(@Req() req: Request,@Param('courseId') courseId: string,@Body() body: CreateQuestionsDto,@UploadedFile() file: Express.Multer.File){
    return this.service.create_question(req['user'].id, courseId, body, file);
  }

  @Patch(':id/question')
  @ApiOperation({ summary: 'Update question' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number })
  @UseInterceptors(FileInterceptor('file'))updateQuestion(  @Param('id', ParseIntPipe) id: number,  @Body() body: CreateQuestionsDto,  @UploadedFile() file: Express.Multer.File,) {
    return this.service.update_question(id, body, file);
  }

  @Post('answer/:questionId')
  @ApiOperation({ summary: 'Create question answer' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'questionId', type: Number })
  @UseInterceptors(FileInterceptor('file')) createAnswer(@Req() req: Request,  @Param('questionId', ParseIntPipe) questionId: number,  @Body() body: CreateQuestionAnswerDto,  @UploadedFile() file: Express.Multer.File,) {
    return this.service.create_question_answer(req['user'].id, questionId, body, file);
  }

  @Patch('answer/:id')
  @ApiOperation({ summary: 'Update question answer' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number }) @UseInterceptors(FileInterceptor('file')) updateAnswer(   @Param('id', ParseIntPipe) id: number,   @Body() body: UpdateQuestionsAnswerDto,   @UploadedFile() file: Express.Multer.File, ) {
    return this.service.update(id, body, file);
  }

  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete question by ID' })
  @ApiParam({ name: 'id', type: Number })
  deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.service.question_remove(id);
  }

  @Delete('answer/:id')
  @ApiOperation({ summary: 'Delete question answer by ID' })
  @ApiParam({ name: 'id', type: Number })
  deleteAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.service.question_answer_remove(id);
  }
}
