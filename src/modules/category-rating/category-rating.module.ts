import { Module } from '@nestjs/common';
import { CategoryRatingService } from './category-rating.service';
import { CategoryRatingController } from './category-rating.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [CategoryRatingController],
  providers: [CategoryRatingService],
})
export class CategoryRatingModule {}
