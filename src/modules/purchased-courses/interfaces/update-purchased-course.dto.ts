import { PartialType } from '@nestjs/swagger';
import { CreatePurchasedCourseDto } from './create-purchased-course.dto';

export class UpdatePurchasedCourseDto extends PartialType(CreatePurchasedCourseDto) {}
