import { Module } from '@nestjs/common';
import { CourseCategoryController } from './course-category.controller';
import { CourseCategoryService } from './course-category.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService]
})
export class CourseCategoryModule {}
