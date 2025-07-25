import { Body, Controller, Get, Param, Patch, Put, Req, UnsupportedMediaTypeException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from "uuid"
import { ProfileService } from './profile.service';
import { UpdatePhone } from './interfaces/phone-dto';
import { Updated_Password } from './interfaces/password-dto';
import { UpdateLastActivityDto } from './interfaces/last-activity';
import { Update_Mentor_ProfileDto } from '../mentor-profiles/interfaces/update-mentor';
import { Auth } from 'src/core/decorators/decorators.service';
import { UserRole } from '@prisma/client';

@ApiTags('Profiles')
@Controller('my')
export class profilesController {

    constructor(private readonly profileService: ProfileService) { }

    @Auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.MENTOR)
    @ApiBearerAuth()
    @Get('profile')
    @ApiOperation({ summary: 'Get all profiles | ADMIN | MENTOR | STUDENT' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved all profiles' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'profile not found' })
    getAll() {
        return this.profileService.get_all();
    }

    @Auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.MENTOR)
    @ApiBearerAuth()
    @Get(':id/profile')
    @ApiOperation({ summary: 'Get one profile by ID | ADMIN | MENTOR | STUDENT' })
    @ApiParam({ name: 'id', type: Number, description: 'profile ID', example: 1 })
    @ApiResponse({ status: 200, description: 'profile successfully found' })
    @ApiResponse({ status: 404, description: 'profile not found' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'profile not found' })
    getOne(@Param('id') id: number) {
        return this.profileService.get_one(+id);
    }

    @Auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.MENTOR)
    @ApiBearerAuth()
    @Patch(':id/update/profile')
    @ApiOperation({ summary: 'Update a profile profile | ADMIN | MENTOR | STUDENT' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'profile profile updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'profile not found' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                    description: 'profile image file (jpg, png, etc.)',
                },
                fullName: {
                    type: 'string',
                    description: 'fullname of user for profile'
                }
            },
        },
    })

    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: "./uploads/image",
            filename: (req, file, cb) => {
                let posterName = uuidv4() + "_" + extname(file.originalname)
                cb(null, posterName)
            }
        }),
        fileFilter: (req, file, callback) => {
            let allowed: string[] = ['image/jpeg', 'image/jpg', 'image/png']
            if (!allowed.includes(file.mimetype)) {
                callback(new UnsupportedMediaTypeException("File tpe must be .jpg | .jpeg | .png "), false)

            }
            callback(null, true)
        }
    }))
    Update(@Param('id') id: number, @UploadedFile() image: Express.Multer.File) {
        return this.profileService.update_profile(+id, image)
    }

    @Auth(UserRole.ADMIN, UserRole.STUDENT)
    @ApiBearerAuth()
    @Get('last-activity')
    @ApiBearerAuth()
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get user last activity (STUDENT) | ADMIN | STUDENT' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved last activity' })
    @ApiResponse({ status: 404, description: 'Last activity not found' })
    async getLastActivity(@Req() req: Request) {
        return this.profileService.getLastActivity(req['user'].id);
    }

    @Auth(UserRole.ADMIN, UserRole.STUDENT)
    @ApiBearerAuth()
    @Put('last-activity')
    @ApiBearerAuth()
    @Auth(UserRole.STUDENT, UserRole.ADMIN)
    @ApiOperation({ summary: 'Update user last activity (STUDENT) | ADMIN | STUDENT' })
    @ApiResponse({ status: 200, description: 'Last activity updated successfully' })
    @ApiResponse({ status: 404, description: 'Last activity not found' })
    async updateLastActivity(
        @Req() req: Request,
        @Body() dto: UpdateLastActivityDto,
    ) {
        return this.profileService.updateLastActivity(req['user'].id, dto);
    }

    @Auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.MENTOR)
    @ApiBearerAuth()
    @Patch('update-phone/:id')
    @ApiOperation({ summary: 'Update user phone number via OTP | ADMIN | MENTOR | STUDENT' })
    @ApiResponse({ status: 200, description: 'Phone number updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updatePhone(
        @Param('id') profile_id: number,
        @Body() payload: UpdatePhone,
    ) {
        return this.profileService.update_phone(+profile_id, payload);
    }

    @Auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.MENTOR)
    @ApiBearerAuth()
    @Patch('update-password/:id')
    @ApiOperation({ summary: 'Update user password | ADMIN | MENTOR | STUDENT' })
    @ApiResponse({ status: 200, description: 'Password updated successfully' })
    @ApiResponse({ status: 400, description: 'Incorrect current password' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updatePassword(
        @Param('id') profile_id: number,
        @Body() payload: Updated_Password,
    ) {
        return this.profileService.update_password(+profile_id, payload);
    }

    @Auth(UserRole.MENTOR)
    @ApiBearerAuth()
    @Patch(':id/update/mentor')
    @ApiOperation({ summary: 'Update a Mentor profile | MENTOR' })
    @ApiParam({ name: 'id', type: Number, description: 'Mentor profile Id', example: 1 })
    @ApiResponse({ status: 200, description: 'Mentor profile updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'Mentor not found' })
    async Updated(@Param('id') id: number, @Body() payload: Update_Mentor_ProfileDto, image: Express.Multer.File) {
        return this.profileService.update(+id, payload);
    }

}
