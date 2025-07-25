import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFiles, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './interfaces/create-course.dto';
import { UpdateCourseDto, UpdateMentorDto } from './interfaces/update-course.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from "uuid"
import { extname } from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCoursesDto, GetOtherCoursesDto, GetOtherMentorDto } from './interfaces/Search-course.dto';
import { CourseLevel, UserRole } from '@prisma/client';
import { CreateAssignedCourseDto } from './interfaces/Add-Assign.dto';
import { Auth } from 'src/core/decorators/decorators.service';

@ApiTags('Courses')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Get('all/courses')
  findAll(@Query() query: GetCoursesDto) {
    return this.courseService.findAll(query);
  }

  @Get(':id/single')
  @ApiOperation({ summary: 'Get one course with full details' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Get(':id/single-full')
  @Auth(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one course | ADMIN | MENTOR | ASSISTANT' })
  findBasic(@Param('id') id: string) {
    return this.courseService.find_single(id);
  }

  @Get('all')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all courses | ADMIN' })
  findAllAdmin(@Query() query: GetOtherCoursesDto) {
    return this.courseService.findAllAdmin(query);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get mentor courses | ADMIN | MENTOR' })
  findAllMentorAdmin(@Query() query: GetOtherCoursesDto) {
    return this.courseService.findAllMentorAdmin(query);
  }

  @Get('my/assgined')
  @Auth(UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get assistant courses | ASSISTANT' })
  findAllAssistantAdmin(@Query() query: GetOtherCoursesDto) {
    return this.courseService.findAllAsisstand(query);
  }

  @Get('mentor')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get mentor\'s own courses | ADMIN' })
  getMentorCourses(@Query() query: GetOtherMentorDto) {
    return this.courseService.findAllMentor(query);
  }

  @Get(':id/assistants')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get assistants of a course with pagination | ADMIN| MENTOR' })
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
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a course | ADMIN | MENTOR' })
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
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign assistant to course | ADMIN | MENTOR' })
  assignCourse(@Body() payload: CreateAssignedCourseDto) {
    return this.courseService.add_assign(payload);
  }

  @Post('unassign')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unassign assistant from course | ADMIN | MENTOR' })
  @ApiQuery({ name: 'assistandId', required: true, type: Number })
  @ApiQuery({ name: 'courseId', required: true, type: String })
  unassign(
    @Query('assistandId') assistandId: number,
    @Query('courseId') courseId: string
  ) {
    return this.courseService.unassign_course(assistandId, courseId);
  }

  @Patch(':id/update/course')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course | ADMIN | MENTOR' })
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
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a course | ADMIN' })
  publish(@Param('id') id: string) {
    return this.courseService.published(id);
  }

  @Post(':id/unpublish')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish a course | ADMIN' })
  unpublish(@Param('id') id: string) {
    return this.courseService.unpublished(id);
  }

  @Patch('update-mentor')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the mentor of a course| ADMIN' })
  @ApiBody({ type: UpdateMentorDto })
  updateMentor(@Body() dto: UpdateMentorDto) {
    return this.courseService.update_mentor(dto.courseId, dto.userId);
  }

  @Delete(':id/delete/course')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course ADMIN | MENTOR' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
