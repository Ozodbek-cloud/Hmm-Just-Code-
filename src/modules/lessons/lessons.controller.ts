import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFile, Put } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './interfaces/create-lesson.dto';
import { UpdateLessonDto } from './interfaces/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse, ApiConsumes, } from '@nestjs/swagger';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @Post()
  @ApiConsumes('multipart/from-data')
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
  @ApiOperation({ summary: 'Create a new lesson with video upload' })
  @ApiResponse({ status: 201, description: 'Lesson successfully created' })
  create(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.lessonsService.create(createLessonDto, video);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({ status: 200, description: 'List of all lessons' })
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id/lesson')
  @ApiOperation({ summary: 'Get one lesson by ID' })
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
  @ApiOperation({ summary: 'Update a lesson and optionally replace the video' })
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

  @Put(':id/view')
  @ApiOperation({ summary: 'Turn lesson view on or off' })
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
  @ApiOperation({ summary: 'Delete a lesson by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Lesson ID to delete' })
  @ApiResponse({ status: 200, description: 'Lesson successfully deleted' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
