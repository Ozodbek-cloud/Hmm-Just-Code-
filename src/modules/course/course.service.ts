import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './interfaces/create-course.dto';
import { UpdateCourseDto } from './interfaces/update-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { GetCoursesDto, GetOtherCoursesDto, GetOtherMentorDto } from './interfaces/Search-course.dto';
import { CreateAssignedCourseDto } from './interfaces/Add-Assign.dto';
import { deleteMovieFile } from 'src/common/utils/delere-utils';
import path from 'path';

@Injectable()
export class CourseService {
  constructor(private prismaService: PrismaService) { }

  async create(payload: CreateCourseDto, banner: Express.Multer.File, introVideo: Express.Multer.File) {
    try {
      let banner_filename = banner.filename
      let introVideo_filename = introVideo.filename
      let created = await this.prismaService.course.create({
        data: {
          ...payload,
          banner: banner_filename,
          ...(introVideo && ({introVideo: introVideo_filename}))
        }
      })
      return {
        success: true,
        message: "Successfully Created Course",
        data: created
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async add_assign(payload: CreateAssignedCourseDto) {
    try {
      let created = await this.prismaService.assignedCourse.create({ data: payload })

      return {
        success: true,
        message: "Successfully Assigned to Course",
        data: created
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
  async unassign_course(assistandId: number, courseId: string) {
    try {
      let deleted = await this.prismaService.assignedCourse.delete({
        where: {
          userId_courseId: {
            userId: assistandId,
            courseId: courseId
          }
        }
      })
      return {
        success: true,
        message: "Successfully UnAssigned Course",
        data: deleted
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)

    }
  }

  async published(id: string) {
    try {
      let publish = await this.prismaService.course.update({
        where: {
          id: id
        },
        data: {
          published: true
        }
      })
      if (!publish) throw new NotFoundException(`This ${id} is not Found`)

      return {
        success: true,
        message: "Succesfully Published",
        data: publish
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)

    }
  }

  async unpublished(id: string) {
    try {
      let publish = await this.prismaService.course.update({
        where: {
          id: id
        },
        data: {
          published: false
        }
      })
      if (!publish) throw new NotFoundException(`This ${id} is not Found`)

      return {
        success: true,
        message: "Succesfully Published",
        data: publish
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)

    }
  }

  async findAll(query: GetCoursesDto) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10
      const offset = query.offset ? parseInt(query.offset) : 0

      const filters: any = {};

      if (query.search) {
        filters.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { about: { contains: query.search, mode: 'insensitive' } }
        ];
      }

      if (query.level) {
        filters.level = query.level;
      }

      if (query.categoryId) {
        filters.categoryId = parseInt(query.categoryId);
      }

      if (query.mentorId) {
        filters.mentorId = parseInt(query.mentorId);
      }

      if (query.price_min || query.price_max) {
        filters.price = {};
        if (query.price_min) {
          filters.price.gte = parseFloat(query.price_min);
        }
        if (query.price_max) {
          filters.price.lte = parseFloat(query.price_max);
        }
      }

      const total = await this.prismaService.course.count({
        where: filters,
      });

      const totalPages = Math.ceil(total / limit);

      const data = await this.prismaService.course.findMany({
        where: filters,
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        message: "Courses fetched successfully",
        data,
        pagination: {
          total,
          limit,
          offset,
          pages: totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }


  async findOne(id: string) {
    try {
      let find_one = await this.prismaService.course.findFirst({
        where: {
          id: id
        },
        include: {
          assignedCourses: {
            select: {
              userId: true,
              courseId: true,
              createdAt: true
            }
          },
          purchasedCourses: {
            select: {
              courseId: true,
              userId: true,
              amount: true,
              paidVia: true,
              purchasedAt: true
            }
          },
          rating: {
            select: {
              id: true,
              rate: true,
              comment: true,
              courseId: true,
              userId: true,
              createdAt: true
            }
          },
          lastActivity: {
            select: {
              id: true,
              userId: true,
              courseId: true,
              groupId: true,
              lessonId: true,
              url: true,
              createdAt: true
            }
          },
          LessonGroup: {
            select: {
              id: true,
              name: true,
              courseId: true,
              createdAt: true
            }
          },
          question: {
            select: {
              id: true,
              userId: true,
              courseId: true,
              text: true,
              file: true,
              read: true,
              readAt: true,
              updatedAt: true,
              createdAt: true
            }
          }
        }
      })
      if (!find_one) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: "Successfully Getted One Course",
        data: find_one
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async find_single(id: string) {
    try {
      let find_one = await this.prismaService.course.findFirst({
        where: {
          id: id
        },
        include: {
          assignedCourses: {
            select: {
              userId: true,
              courseId: true,
              createdAt: true
            }
          },
          purchasedCourses: {
            select: {
              courseId: true,
              userId: true,
              amount: true,
              paidVia: true,
              purchasedAt: true
            }
          },
          rating: {
            select: {
              id: true,
              rate: true,
              comment: true,
              courseId: true,
              userId: true,
              createdAt: true
            }
          },
          lastActivity: {
            select: {
              id: true,
              userId: true,
              courseId: true,
              groupId: true,
              lessonId: true,
              url: true,
              createdAt: true
            }
          },
          LessonGroup: {
            select: {
              id: true,
              name: true,
              courseId: true,
              createdAt: true
            }
          },
          question: {
            select: {
              id: true,
              userId: true,
              courseId: true,
              text: true,
              file: true,
              read: true,
              readAt: true,
              updatedAt: true,
              createdAt: true
            }
          }
        }
      })
      if (!find_one) throw new NotFoundException(`This ${id} is not found`)

      return {
        success: true,
        message: "Successfully Getted One Course",
        data: find_one
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAllAdmin(query: GetOtherCoursesDto) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10
      const offset = query.offset ? parseInt(query.offset) : 0

      const filters: any = {};

      if (query.search) {
        filters.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { about: { contains: query.search, mode: 'insensitive' } }
        ];
      }

      if (query.level) {
        filters.level = query.level;
      }

      if (query.categoryId) {
        filters.categoryId = parseInt(query.categoryId);
      }

      if (query.mentorId) {
        filters.mentorId = parseInt(query.mentorId);
      }

      if (query.published) {
        filters.published = query.published
      }

      if (query.price_min || query.price_max) {
        filters.price = {};
        if (query.price_min) {
          filters.price.gte = parseFloat(query.price_min);
        }
        if (query.price_max) {
          filters.price.lte = parseFloat(query.price_max);
        }
      }

      const total = await this.prismaService.course.count({
        where: filters,
      });

      const totalPages = Math.ceil(total / limit);

      const data = await this.prismaService.course.findMany({
        where: filters,
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        message: "Courses fetched successfully",
        data,
        pagination: {
          total,
          limit,
          offset,
          pages: totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
  async findAllMentorAdmin(query: GetOtherCoursesDto) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10
      const offset = query.offset ? parseInt(query.offset) : 0

      const filters: any = {};

      if (query.search) {
        filters.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { about: { contains: query.search, mode: 'insensitive' } }
        ];
      }

      if (query.level) {
        filters.level = query.level;
      }

      if (query.categoryId) {
        filters.categoryId = parseInt(query.categoryId);
      }

      if (query.mentorId) {
        filters.mentorId = parseInt(query.mentorId);
      }

      if (query.published) {
        filters.published = query.published
      }

      if (query.price_min || query.price_max) {
        filters.price = {};
        if (query.price_min) {
          filters.price.gte = parseFloat(query.price_min);
        }
        if (query.price_max) {
          filters.price.lte = parseFloat(query.price_max);
        }
      }

      const total = await this.prismaService.course.count({
        where: filters,
      });

      const totalPages = Math.ceil(total / limit);

      const data = await this.prismaService.course.findMany({
        where: filters,
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        message: "Courses fetched successfully",
        data,
        pagination: {
          total,
          limit,
          offset,
          pages: totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAllAsisstand(query: GetOtherCoursesDto) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10
      const offset = query.offset ? parseInt(query.offset) : 0

      const filters: any = {};

      if (query.search) {
        filters.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { about: { contains: query.search, mode: 'insensitive' } }
        ];
      }

      if (query.level) {
        filters.level = query.level;
      }

      if (query.categoryId) {
        filters.categoryId = parseInt(query.categoryId);
      }

      if (query.mentorId) {
        filters.mentorId = parseInt(query.mentorId);
      }

      if (query.published) {
        filters.published = query.published
      }

      if (query.price_min || query.price_max) {
        filters.price = {};
        if (query.price_min) {
          filters.price.gte = parseFloat(query.price_min);
        }
        if (query.price_max) {
          filters.price.lte = parseFloat(query.price_max);
        }
      }

      const total = await this.prismaService.course.count({
        where: filters,
      });

      const totalPages = Math.ceil(total / limit);

      const data = await this.prismaService.course.findMany({
        where: filters,
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        message: "Courses fetched successfully",
        data,
        pagination: {
          total,
          limit,
          offset,
          pages: totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCourseWithAssistants(courseId: string, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const find_course = await this.prismaService.course.findFirst({
        where: { id: courseId },
      });

      if (!find_course) {
        throw new NotFoundException(`This ${courseId} is not found!`);
      }

      const assistants = await this.prismaService.assignedCourse.findMany({
        where: { courseId },
        skip: offset,
        take: limit,
        select: {
          userId: true,
          courseId: true,
          users: {
            select: {
              fullName: true,
              role: true,
            },
          },
        },
      });

      const total = await this.prismaService.assignedCourse.count({
        where: { courseId },
      });

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Successfully fetched course assistants with pagination',
        data: {
          course: find_course,
          assistants,
        },
        pagination: {
          total,
          page,
          limit,
          offset,
          pages: totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAllMentor(query: GetOtherMentorDto) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10
      const offset = query.offset ? parseInt(query.offset) : 0

      const filters: any = {};

      if (query.id) {
        filters.id = parseInt(query.id)
      }

      if (query.search) {
        filters.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { about: { contains: query.search, mode: 'insensitive' } }
        ];
      }

      if (query.level) {
        filters.level = query.level;
      }

      if (query.categoryId) {
        filters.categoryId = parseInt(query.categoryId);
      }

      if (query.published) {
        filters.published = query.published
      }

      if (query.price_min || query.price_max) {
        filters.price = {};
        if (query.price_min) {
          filters.price.gte = parseFloat(query.price_min);
        }
        if (query.price_max) {
          filters.price.lte = parseFloat(query.price_max);
        }
      }

      const total = await this.prismaService.course.count({
        where: filters,
      });

      const totalPages = Math.ceil(total / limit);

      const data = await this.prismaService.course.findMany({
        where: filters,
        skip: offset,
        take: limit,
      });

      return {
        success: true,
        message: "Courses fetched successfully",
        data,
        pagination: {
          total,
          limit,
          offset,
          pages: totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(id: string, payload: UpdateCourseDto, banner: Express.Multer.File, introVideo: Express.Multer.File) {
    try {
      const course = await this.prismaService.course.findUnique({
        where: { id },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      const banner_filename = banner?.filename || course.banner;
      const introVideo_filename = introVideo?.filename || course.introVideo;
      let updateat = new Date();
      const updated = await this.prismaService.course.update({
        where: { id },
        data: {
          ...payload,
          banner: banner_filename,
          updatedAt: updateat.toString(),
          ...(introVideo && ({introVideo: introVideo_filename})),
        },
      });

      if (banner && course.banner && course.banner !== banner.filename) {
        const oldBannerPath = path.resolve('uploads/banners', course.banner);
        deleteMovieFile(oldBannerPath);
      }

      if (introVideo && course.introVideo && course.introVideo !== introVideo.filename) {
        const oldVideoPath = path.resolve('uploads/videos', course.introVideo);
        deleteMovieFile(oldVideoPath);
      }

      return {
        success: true,
        message: 'Successfully Updated Course',
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
  async update_mentor(courseId: string, userId: number) {
    try {
      let updated = await this.prismaService.course.update({
        where: {
          id: courseId
        },
        data: {
          mentorId: userId
        }
      })
      if (!courseId || userId) throw new NotFoundException(`This ID not found`)
      return {
        success: true,
        message: "Successfully Updated Mentor Course",
        data: updated
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: string) {
    try {
      let deleted = await this.prismaService.course.delete({
        where: {
          id: id
        }
      })
      if (!deleted) throw new NotFoundException(`This ${id} is not Found`)

      return {
        success: true,
        message: "Successfuly Deleted Course",
        data: deleted
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }



}
