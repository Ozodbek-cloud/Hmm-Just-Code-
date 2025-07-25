import { Controller, Post, Get, Param, Body, Put, Delete, Query, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateMentor, CreateAsisstandDto } from './dto/create-user.dto';
import { UpdateMentorsDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/core/decorators/decorators.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('by-fullName/:name')
  @ApiOperation({ summary: 'Find users by fullName' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiResponse({ status: 200, description: 'Users fetched by course name' })
  findByCourseName(@Param('name') name: string, @Query() query: any) {
    return this.usersService.findAllByName(name, query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by name and role' })
  @ApiQuery({ name: 'name', required: false, description: 'Search by fullName' })
  @ApiQuery({ name: 'role', enum: UserRole, required: false, description: 'Filter by role' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'Filtered users list returned' })
  async findAllByNameAndRole(@Query('name') name: string, @Query() query: any) {
    return this.usersService.findAllByNameAndRole(name, query);
  }

  @Get('mentor-profile/:id')
  @ApiOperation({ summary: 'Get mentor profile by user ID' })
  @ApiResponse({ status: 200, description: 'Mentor profile returned' })
  findMentorByUserId(@Param('id') id: number) {
    return this.usersService.find_by_mentor(+id);
  }

  @Get(':id/full/details/users')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get full user details by ID | ADMIN' })
  @ApiResponse({ status: 200, description: 'Single user with all relations returned' })
  findSingleUser(@Param('id') id: number) {
    return this.usersService.find_single(+id);
  }

  @Get('find_by/:phone/users')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User by user Phone | ADMIN | MENTOR' })
  @ApiResponse({ status: 200, description: 'Phone User returned' })
  findByPhone(@Param('phone') phone: string) {
    return this.usersService.find_by_phone(phone);
  }

  @Post('admin')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Admin | ADMIN' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  createAdmin(@Body() payload: CreateUserDto) {
    return this.usersService.create_admin(payload);
  }

  @Post('mentor')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Mentor | ADMIN' })
  @ApiResponse({ status: 201, description: 'Mentor created successfully' })
  createMentor(@Body() payload: CreateMentor) {
    return this.usersService.create_mentor(payload);
  }

  @Post('assistant')
  @Auth(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Assistand | ADMIN | MENTOR' })
  @ApiResponse({ status: 201, description: 'Assistant created successfully' })
  createAssistant(@Body() payload: CreateAsisstandDto) {
    return this.usersService.create_assistand(payload);
  }

  @Patch('mentor/:id')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update mentor user and profile | ADMIN' })
  @ApiResponse({ status: 200, description: 'Mentor updated successfully' })
  updateMentor(
    @Param('id') id: number,
    @Body() payload: UpdateMentorsDto
  ) {
    return this.usersService.update_mentor(+id, payload);
  }

  @Delete(':id/delete')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID | ADMIN' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  removeUser(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
