import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UnsupportedMediaTypeException } from '@nestjs/common';
import { LessonFileService } from './lesson-file.service';
import { CreateLessonFileDto } from './dto/create-lesson-file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/core/decorators/decorators.service';

@ApiTags('Lesson Files')
@Controller('lesson-file')
export class LessonFileController {
  constructor(private readonly lessonFileService: LessonFileService) { }

  @Get('all/files')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lesson files | ADMIN | MENTOR' })
  @ApiResponse({ status: 200, description: 'All lesson files retrieved successfully' })
  FindAll() {
    return this.lessonFileService.findAll();
  }

  @Get(':id/file')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific lesson file by ID | ADMIN | MENTOR' })
  @ApiParam({ name: 'id', type: 'string', example: '1' })
  @ApiResponse({ status: 200, description: 'Lesson file found' })
  @ApiResponse({ status: 404, description: 'Lesson file not found' })
  findOne(@Param('id') id: string) {
    return this.lessonFileService.findOne(+id);
  }

  @Post('add/file')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a lesson image file with metadata | ADMIN | MENTOR' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Lesson file successfully created' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const videoName = uuidv4() + extname(file.originalname);
          cb(null, videoName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowed = ['video/mp4', 'video/webm'];
        if (!allowed.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException('Only .mp4 | .webm types are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  Create(@Body() createLessonFileDto: CreateLessonFileDto, @UploadedFile() file: Express.Multer.File) {
    return this.lessonFileService.create(createLessonFileDto, file);
  }

  @Patch(':id/update-file')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a lesson file by ID | ADMIN | MENTOR' })
  @ApiParam({ name: 'id', type: 'string', example: '1' })
  @ApiBody({ type: UpdateLessonFileDto })
  @ApiResponse({ status: 200, description: 'Lesson file updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson file not found' })
  update(@Param('id') id: string, @Body() updateLessonFileDto: UpdateLessonFileDto) {
    return this.lessonFileService.update(+id, updateLessonFileDto);
  }

  @Delete(':id/delete-file')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a lesson file by ID | ADMIN | MENTOR' })
  @ApiParam({ name: 'id', type: 'string', example: '1' })
  @ApiResponse({ status: 200, description: 'Lesson file deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson file not found' })
  remove(@Param('id') id: string) {
    return this.lessonFileService.remove(+id);
  }
}
