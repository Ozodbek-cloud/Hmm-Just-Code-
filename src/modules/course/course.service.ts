import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { GetCoursesDto, GetOtherCoursesDto } from './dto/Search-course.dto';

@Injectable()
export class CourseService {
  constructor(private prismaService: PrismaService) { }

  async create(payload: CreateCourseDto, banner: Express.Multer.File, introVideo: Express.Multer.File) {
    let banner_filename = banner.filename
    let introVideo_filename = introVideo.filename
    let created = await this.prismaService.course.create({
      data: {
        ...payload,
        banner: banner_filename,
        introVideo: introVideo_filename
      }
    })
    return {
      success: true,
      message: "Successfully Created Course",
      data: created
    }
  }

  async findAll(query: GetCoursesDto) {
    const limit = query.limit ? parseInt(query.limit) : 10
    const offset = query.offset ? parseInt(query.offset) : 0

    const filters: any = {};

    if (query.search) {
      filters.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.level) {
      filters.level = query.level;
    }

    if (query.category_id) {
      filters.category_id = parseInt(query.category_id);
    }

    if (query.mentor_id) {
      filters.mentor_id = parseInt(query.mentor_id);
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
  }


  async findOne(id: string) {
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
  }

  async find_single(id: string) {
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
  }

  async findAllAdmin(query: GetOtherCoursesDto) {
    const limit = query.limit ? parseInt(query.limit) : 10
    const offset = query.offset ? parseInt(query.offset) : 0

    const filters: any = {};

    if (query.search) {
      filters.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.level) {
      filters.level = query.level;
    }

    if (query.category_id) {
      filters.category_id = parseInt(query.category_id);
    }

    if (query.mentor_id) {
      filters.mentor_id = parseInt(query.mentor_id);
    }

    if(query.published) {
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
  }
  async findAllMentorAdmin(query: GetOtherCoursesDto) {
    const limit = query.limit ? parseInt(query.limit) : 10
    const offset = query.offset ? parseInt(query.offset) : 0

    const filters: any = {};

    if (query.search) {
      filters.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.level) {
      filters.level = query.level;
    }

    if (query.category_id) {
      filters.category_id = parseInt(query.category_id);
    }

    if (query.mentor_id) {
      filters.mentor_id = parseInt(query.mentor_id);
    }

    if(query.published) {
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
  }
 
  async findAllAsisstand(query: GetOtherCoursesDto) {
    const limit = query.limit ? parseInt(query.limit) : 10
    const offset = query.offset ? parseInt(query.offset) : 0

    const filters: any = {};

    if (query.search) {
      filters.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.level) {
      filters.level = query.level;
    }

    if (query.category_id) {
      filters.category_id = parseInt(query.category_id);
    }

    if (query.mentor_id) {
      filters.mentor_id = parseInt(query.mentor_id);
    }

    if(query.published) {
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
  }

  async getCourseWithAssistants(courseId: string, page = 1, limit = 10) {
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
}


  async update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  async remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
