import { Body, Controller, Get, Param, Patch, Put, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from "uuid"
import { UsersService } from './users.service';
import { UpdateUserDto } from './interfaces/user-dto';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) { }


    @Patch(':id/update')
    @ApiOperation({ summary: 'Update a User profile' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', type: Number, description: 'User profile Id', example: 1 })
    @ApiResponse({ status: 200, description: 'User profile updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'User not found' })
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
    Update(@Param('id') id: number, @Body() payload: UpdateUserDto, image: Express.Multer.File) {
        return this.userService.update_profile(+id, payload, image)
    }


    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved all users' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'User not found' })
    getAll() {
        return this.userService.get_all();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get one user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID', example: 1 })
    @ApiResponse({ status: 200, description: 'User successfully found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 400, description: 'Bad request or validation error' })
    @ApiResponse({ status: 404, description: 'User not found' })
    getOne(@Param('id') id: number) {
        return this.userService.get_one(+id);
    }

}
