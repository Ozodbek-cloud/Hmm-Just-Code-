import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateAsisstandDto, CreateMentor, CreateUserDto } from './dto/create-user.dto';
import { UpdateMentorsDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) { }

  async create_admin(payload: CreateUserDto) {
    try {
      let created = await this.prismaService.users.create({
        data: { ...payload, role: "ADMIN" }
      });

      return {
        success: true,
        message: "Successully Created Admin",
        data: created
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create admin');
    }
  }

  async findAllByName(name: string, query: any) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10;
      const page = query.page ? parseInt(query.page) : 1;
      const offset = (page - 1) * limit;

      const where = { fullName: name };

      const total = await this.prismaService.users.count({ where });

      const data = await this.prismaService.users.findMany({ where, skip: offset, take: limit });

      return {
        success: true,
        message: `Successfully Getted Users`,
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch users by name');
    }
  }

  async findAllByNameAndRole(name: string, query: any) {
    try {
      const limit = query.limit ? parseInt(query.limit) : 10;
      const page = query.page ? parseInt(query.page) : 1;
      const offset = (page - 1) * limit;

      const where: any = {};
      if (name) where.fullName = { contains: name, mode: 'insensitive' };
      if (query.role && Object.values(UserRole).includes(query.role)) where.role = query.role;

      const total = await this.prismaService.users.count({ where });
      const data = await this.prismaService.users.findMany({ where, skip: offset, take: limit });

      return {
        success: true,
        message: `Successfully Fetched Users`,
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch users by name and role');
    }
  }

  async find_by_phone(phone: string) {
    try {
      let find_phone = await this.prismaService.users.findFirst({ where: { phone } });
      if (!find_phone) throw new NotFoundException(`This ${phone} is not found`);

      return {
        success: true,
        message: "Successfully Getted By Phone",
        data: find_phone
      };
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch user by phone');
    }
  }

  async create_mentor(payload: CreateMentor) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const user = await tx.users.create({
          data: {
            phone: payload.phone,
            fullName: payload.fullName,
            password: payload.password,
            role: 'MENTOR',
          },
        });

        const mentorProfile = await tx.mentorProfile.create({
          data: {
            about: payload.about,
            job: payload.job,
            experience: payload.experience,
            telegram: payload.telegram,
            instagram: payload.instagram,
            linkedin: payload.linkedin,
            facebook: payload.facebook,
            github: payload.github,
            website: payload.website,
            user_id: user.id
          },
        });

        return {
          success: true,
          message: "Successfully Created Mentor",
          data: {
            id: user.id,
            phone: user.phone,
            fullName: user.fullName,
            password: user.password,
            about: mentorProfile.about,
            job: mentorProfile.job,
            experience: mentorProfile.experience,
            telegram: mentorProfile.telegram,
            linkedin: mentorProfile.linkedin,
            facebook: mentorProfile.facebook,
            github: mentorProfile.github,
            website: mentorProfile.website
          }
        };
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create mentor');
    }
  }

  async create_assistand(payload: CreateAsisstandDto) {
    try {
      let created = await this.prismaService.users.create({
        data: { ...payload, role: "ASSISTANT" }
      });
      return {
        success: true,
        message: "Successfully Created Asisstant",
        data: created
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create assistant');
    }
  }

  async find_by_mentor(id: number) {
    try {
      let findOne = await this.prismaService.mentorProfile.findFirst({ where: { user_id: id } });
      if (!findOne) throw new NotFoundException(`This ${id} is not found`);

      return {
        success: true,
        message: "Successfully Getted One User",
        data: findOne
      };
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch mentor profile');
    }
  }

  async find_single(id: number) {
    try {
      const single = await this.prismaService.users.findFirst({
        where: { id },
        select: {
          id: true,
          phone: true,
          fullName: true,
          role: true,
          image: true,
          createdAt: true,

          courses: {
            select: {
              id: true,
              name: true,
              about: true,
              price: true,
              banner: true,
              introVideo: true,
              level: true,
              published: true,
              createdAt: true
            }
          },

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
              rate: true,
              comment: true,
              userId: true,
              courseId: true,
              createdAt: true
            }
          },

          lastActivity: {
            select: {
              userId: true,
              courseId: true,
              groupId: true,
              lessonId: true,
              url: true,
              createdAt: true
            }
          },

          lessonView: {
            select: {
              lessonId: true,
              userId: true,
              view: true
            }
          },

          homeworkSubmission: {
            select: {
              id: true,
              homeworkId: true,
              text: true,
              reason: true,
              status: true,
              userId: true,
              createdAt: true,
              updatedAt: true
            }
          },

          examResult: {
            select: {
              id: true,
              lessonGroupId: true,
              userId: true,
              passed: true,
              corrects: true,
              wrongs: true,
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
          },

          questionAnswer: {
            select: {
              id: true,
              questionId: true,
              userId: true,
              text: true,
              file: true,
              updatedAt: true,
              createdAt: true
            }
          }
        }
      });

      return {
        success: true,
        message: "Successfully Getted Single User",
        data: single
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch single user');
    }
  }


  async update_mentor(userId: number, payload: UpdateMentorsDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const user = await tx.users.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        if (user.role !== 'MENTOR') throw new Error('User is not a mentor');

        const updatedUser = await tx.users.update({
          where: { id: userId },
          data: {
            ...(payload.phone && { phone: payload.phone }),
            ...(payload.fullName && { fullName: payload.fullName }),
            ...(payload.password && { password: payload.password }),
          },
        });

        const updatedMentorProfile = await tx.mentorProfile.update({
          where: { user_id: userId },
          data: {
            ...(payload.about && { about: payload.about }),
            ...(payload.job && { job: payload.job }),
            ...(payload.experience && { experience: payload.experience }),
            ...(payload.telegram && { telegram: payload.telegram }),
            ...(payload.instagram && { instagram: payload.instagram }),
            ...(payload.linkedin && { linkedin: payload.linkedin }),
            ...(payload.facebook && { facebook: payload.facebook }),
            ...(payload.github && { github: payload.github }),
            ...(payload.website && { website: payload.website }),
          },
        });

        return {
          success: true,
          message: "Successfully Updated Mentor",
          data: {
            phone: updatedUser.phone,
            fullName: updatedUser.fullName,
            password: updatedUser.password,
            about: updatedMentorProfile.about,
            job: updatedMentorProfile.job,
            experience: updatedMentorProfile.experience,
            telegram: updatedMentorProfile.telegram,
            instagram: updatedMentorProfile.instagram,
            linkedin: updatedMentorProfile.linkedin,
            facebook: updatedMentorProfile.facebook,
            github: updatedMentorProfile.github,
            website: updatedMentorProfile.website,
          },
        };
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update mentor');
    }
  }

  async remove(id: number) {
    try {
      let find_deleted = await this.prismaService.users.delete({ where: { id } });
      if (!find_deleted) throw new NotFoundException(`This ${id} is not found`);

      return {
        success: true,
        message: "Successfully Deleted User",
        data: find_deleted
      };
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to delete user');
    }
  }
}
