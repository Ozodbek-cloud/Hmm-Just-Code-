import { Body, Controller, Get, Param, Patch, Req, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common';
import { MentorProfilesService } from './mentor-profiles.service';
import { Update_Mentor_ProfileDto } from './interfaces/update-mentor';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from 'src/core/decorators/decorators.service';
import { UserRole } from '@prisma/client';


@ApiTags('Mentor Profiles')
@Controller('mentor-profiles')
export class MentorProfilesController {
    constructor(private readonly mentorService: MentorProfilesService) { }

    @Get(':id/mentor-id')
    @Auth(UserRole.ADMIN, UserRole.MENTOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get One Mentor Profile | ADMIN | MENTOR' })
    @ApiParam({ name: 'id', type: Number, description: 'Mentor profile Id', example: 1 })
    @ApiResponse({ status: 200, description: 'Mentor profile getted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'Mentor not found' })
    Get_One(@Param('id') id: number) {
        return this.mentorService.get_one_by_id(+id);
    }

    @Get(':job/mentor-job')
    @Auth(UserRole.ADMIN, UserRole.MENTOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get By Job Mentor Profile | ADMIN | MENTOR' })
    @ApiParam({ name: 'job', type: String, description: 'Mentor profile Job', example: 'Policer' })
    @ApiResponse({ status: 200, description: 'Mentor profile Getted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'Mentor not found' })
    Get_By_Job(@Param('job') job: string) {
        return this.mentorService.get_one_by_job(job);
    }

    @Get(':year/mentor-year')
    @Auth(UserRole.ADMIN, UserRole.MENTOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get By Experience Year Mentor Profile | ADMIN | MENTOR' })
    @ApiParam({ name: 'year', type: Number, description: 'Mentor profile Experience Year', example: 5 })
    @ApiResponse({ status: 200, description: 'Mentor profile Getted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'Mentor not found' })
    Get_By_Experience(@Param('year') year: number) {
        return this.mentorService.get_one_by_experience(+year);
    }


}
