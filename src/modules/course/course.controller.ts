import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFiles, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto, UpdateMentorDto } from './dto/update-course.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from "uuid"
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCoursesDto, GetOtherCoursesDto, GetOtherMentorDto } from './dto/Search-course.dto';
import { CourseLevel } from '@prisma/client';
import { CreateAssignedCourseDto } from './dto/Add-Assign.dto';

@ApiTags('Courses')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Get('all/courses')
  @ApiQuery({ name: 'price_min', required: false, type: String, example: '0' })
  @ApiQuery({ name: 'price_max', required: false, type: String, example: '100' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'javascript' })
  @ApiQuery({ name: 'level', required: false, enum: CourseLevel, example: 'INTERMEDIATE' })
  @ApiQuery({ name: 'category_id', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'mentor_id', required: false, type: String, example: '5' })
  @ApiQuery({ name: 'offset', required: false, type: String, example: '0' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '8' })
  findAll(@Query() query: GetCoursesDto) {
    return this.courseService.findAll(query);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get all courses (for admin)' })
  findAllAdmin(@Query() query: GetOtherCoursesDto) {
    return this.courseService.findAllAdmin(query);
  }

  @Get('mentor')
  @ApiOperation({ summary: 'Get mentor courses (admin)' })
  findAllMentorAdmin(@Query() query: GetOtherCoursesDto) {
    return this.courseService.findAllMentorAdmin(query);
  }

  @Get('assistant')
  @ApiOperation({ summary: 'Get assistant courses (admin)' })
  findAllAssistantAdmin(@Query() query: GetOtherCoursesDto) {
    return this.courseService.findAllAsisstand(query);
  }

  @Get('mentor/courses')
  @ApiOperation({ summary: 'Get mentor\'s own courses' })
  getMentorCourses(@Query() query: GetOtherMentorDto) {
    return this.courseService.findAllMentor(query);
  }

  @Get(':id/single')
  @ApiOperation({ summary: 'Get one course with full details' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Get(':id/single-full')
  @ApiOperation({ summary: 'Get one course' })
  findBasic(@Param('id') id: string) {
    return this.courseService.find_single(id);
  }

  @Get(':id/assistants')
  @ApiOperation({ summary: 'Get assistants of a course with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAssistants(
    @Param('id') courseId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return this.courseService.getCourseWithAssistants(courseId, Number(page), Number(limit));
  }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 1 },
        { name: 'introVideo', maxCount: 1 }
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'banner') {
              cb(null, './uploads/banners');
            } else if (file.fieldname === 'introVideo') {
              cb(null, './uploads/videos');
            } else {
              cb(new UnsupportedMediaTypeException('Invalid file field'), "null");
            }
          },
          filename: (req, file, cb) => {
            const fileName = uuidv4() + extname(file.originalname);
            cb(null, fileName);
          }
        }),
        fileFilter: (req, file, callback) => {
          if (file.fieldname === 'banner') {
            const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowed.includes(file.mimetype)) {
              return callback(new UnsupportedMediaTypeException('File type must be .jpg | .jpeg | .png'), false);
            }
          }

          if (file.fieldname === 'introVideo') {
            const allowed = ['video/mp4', 'video/webm'];
            if (!allowed.includes(file.mimetype)) {
              return callback(new UnsupportedMediaTypeException('Only .mp4 | .webm types are allowed'), false);
            }
          }

          callback(null, true);
        }
      }
    )
  )
  create(@Body() createCourseDto: CreateCourseDto, @UploadedFiles() files: { banner?: Express.Multer.File[]; introVideo?: Express.Multer.File[] }) {
    const bannerFile = files.banner?.[0];
    const introVideoFile = files.introVideo?.[0];

    if (!bannerFile || !introVideoFile) {
      throw new UnsupportedMediaTypeException('Both banner and introVideo files are required');
    }

    return this.courseService.create(createCourseDto, bannerFile, introVideoFile);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign assistant to course' })
  assignCourse(@Body() payload: CreateAssignedCourseDto) {
    return this.courseService.add_assign(payload);
  }

  @Post('unassign')
  @ApiOperation({ summary: 'Unassign assistant from course' })
  @ApiQuery({ name: 'assistandId', required: true, type: Number })
  @ApiQuery({ name: 'courseId', required: true, type: String })
  unassign(
    @Query('assistandId') assistandId: number,
    @Query('courseId') courseId: string
  ) {
    return this.courseService.unassign_course(assistandId, courseId);
  }

  @Patch(':id/update/course')
  @ApiOperation({ summary: 'Update a course' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 1 },
        { name: 'introVideo', maxCount: 1 }
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'banner') {
              cb(null, './uploads/banners');
            } else if (file.fieldname === 'introVideo') {
              cb(null, './uploads/videos');
            } else {
              cb(new UnsupportedMediaTypeException('Invalid file field'), "null");
            }
          },
          filename: (req, file, cb) => {
            const fileName = uuidv4() + extname(file.originalname);
            cb(null, fileName);
          }
        }),
        fileFilter: (req, file, callback) => {
          if (file.fieldname === 'banner') {
            const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowed.includes(file.mimetype)) {
              return callback(new UnsupportedMediaTypeException('File type must be .jpg | .jpeg | .png'), false);
            }
          }

          if (file.fieldname === 'introVideo') {
            const allowed = ['video/mp4', 'video/webm'];
            if (!allowed.includes(file.mimetype)) {
              return callback(new UnsupportedMediaTypeException('Only .mp4 | .webm types are allowed'), false);
            }
          }

          callback(null, true);
        }
      }
    )
  )
  update(@Param('id') id: string, @Body() payload: UpdateCourseDto, @UploadedFiles() files: { banner?: Express.Multer.File[], introVideo?: Express.Multer.File[] }) {
    const bannerFile = files.banner?.[0];
    const introVideoFile = files.introVideo?.[0];

    if (!bannerFile || !introVideoFile) {
      throw new UnsupportedMediaTypeException('Both banner and introVideo files are required');
    }

    return this.courseService.update(id, payload, bannerFile, introVideoFile);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a course' })
  publish(@Param('id') id: string) {
    return this.courseService.published(id);
  }

  @Post(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish a course' })
  unpublish(@Param('id') id: string) {
    return this.courseService.unpublished(id);
  }

  @Patch('update-mentor')
  @ApiOperation({ summary: 'Update the mentor of a course' })
  @ApiBody({ type: UpdateMentorDto })
  updateMentor(@Body() dto: UpdateMentorDto) {
    return this.courseService.update_mentor(dto.courseId, dto.userId);
  }

  @Delete(':id/delete/course')
  @ApiOperation({ summary: 'Delete a course' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
