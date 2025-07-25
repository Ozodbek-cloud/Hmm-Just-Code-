import { Controller, Post, Get, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { CategoryRatingService } from './category-rating.service';
import { CreateRatingDto } from './interfaces/create-category-rating.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/core/decorators/decorators.service';

@ApiTags('Category Ratings')
@Controller('category-ratings')
export class CategoryRatingController {
  constructor(private readonly ratingService: CategoryRatingService) { }


  @Get('latest')
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({ status: 200, description: 'All ratings retrieved successfully' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get ratings by course ID with pagination' })
  @ApiParam({ name: 'courseId', type: String, description: 'ID of the course' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAllByCourseId(
    @Param('courseId') courseId: string,
    @Query() query: any,
  ) {
    return this.ratingService.findAllByCourseId(courseId, query);
  }

  @Get('analytics/:courseId')
  @ApiOperation({ summary: 'Get rating analytics by course ID' })
  @ApiParam({ name: 'courseId', type: String, description: 'ID of the course' })
  getAnalytics(@Param('courseId') courseId: string) {
    return this.ratingService.getAnalytics(courseId);
  }

  @Auth(UserRole.STUDENT)
  @ApiBearerAuth()
  @Post('add/rating')
  @ApiOperation({ summary: 'Create a new rating  | STUDENT' })
  @ApiBody({ type: CreateRatingDto })
  @ApiResponse({ status: 201, description: 'Successfully created rating' })
  create(@Req() req: Request, @Body() payload: CreateRatingDto) {
    return this.ratingService.create(req['user'].id, payload);
  }

  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rating by ID | ADMIN' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the rating to delete' })
  remove(@Param('id') id: number) {
    return this.ratingService.remove(+id);
  }
}
