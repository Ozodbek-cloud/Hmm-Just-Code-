import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UnsupportedMediaTypeException, UploadedFiles } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from "uuid"
import { extname } from 'path';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

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


  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
