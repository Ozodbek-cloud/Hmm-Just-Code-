import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFile, Put } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './interfaces/create-lesson.dto';
import { UpdateLessonDto } from './interfaces/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse, ApiConsumes, ApiBearerAuth, } from '@nestjs/swagger';
import { Auth } from 'src/core/decorators/decorators.service';
import { UserRole } from '@prisma/client';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @Post()
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('video', {
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
  @ApiOperation({ summary: 'Create a new lesson with video upload | ADMIN | MENTOR' })
  @ApiResponse({ status: 201, description: 'Lesson successfully created' })
  create(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.lessonsService.create(createLessonDto, video);
  }

  @Get('all')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lessons | ADMIN | MENTOR ' })
  @ApiResponse({ status: 200, description: 'List of all lessons' })
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id/detail')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Detail OF lessons | ADMIN | MENTOR' })
  @ApiResponse({ status: 200, description: 'Detail of all lessons' })
  finddetail() {
    return this.lessonsService.findAll();
  }

  @Get(':id/lesson')
  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one lesson by ID | STUDENT' })
  @ApiParam({ name: 'id', required: true, description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Single lesson data' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id/lesson-update')
  @UseInterceptors(
    FileInterceptor('video', {
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
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a lesson and optionally replace the video | ADMIN | MENTOR' })
  @ApiParam({ name: 'id', required: true, description: 'Lesson ID to update' })
  @ApiConsumes('multipart/from-data')
  @ApiResponse({ status: 200, description: 'Lesson successfully updated' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.lessonsService.update(id, updateLessonDto, video);
  }

  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @Put(':id/view')
  @ApiOperation({ summary: 'Turn lesson view on or off | STUDENT' })
  @ApiParam({ name: 'id', required: true, description: 'Lesson ID' })
  @ApiQuery({ name: 'view', required: true, type: Boolean, example: true })
  @ApiResponse({ status: 200, description: 'Successfully updated lesson view' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async turnView(
    @Param('id') id: string,
    @Body('view') view: boolean,
  ) {
    return this.lessonsService.turn_view(id, view);
  }

  @Delete(':id/lesson-delete')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a lesson by ID | ADMIN | MENTOR' })
  @ApiParam({ name: 'id', required: true, description: 'Lesson ID to delete' })
  @ApiResponse({ status: 200, description: 'Lesson successfully deleted' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
