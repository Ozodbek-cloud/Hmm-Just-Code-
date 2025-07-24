import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Matches } from 'class-validator';

export class CreatePurchasedCourseDto {
    @ApiProperty({ example: 'course_abc123', description: 'ID of the course the student is purchasing', })
    @IsString()
    courseId: string;

    @ApiProperty({ example: '+998902400005', description: 'Phone number of the student'})
    @IsString()
    @IsPhoneNumber()
    phone: string;
}
