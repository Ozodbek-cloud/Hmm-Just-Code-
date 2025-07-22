import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFile, Query } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from "uuid"
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) { }

  @Post('add')
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

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAll(@Param('id') id: string, @Query() query: any) {
    return this.homeworksService.findAllByCourseId(id, query);
  }

  @Get(':id/detail')
  findOne(@Param('id') id: string) {
    return this.homeworksService.findOne(+id);
  }

  @Patch(':id/update/homework')
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
  remove(@Param('id') id: string) {
    return this.homeworksService.remove(+id);
  }
}
