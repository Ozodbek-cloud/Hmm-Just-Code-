import { PartialType } from '@nestjs/swagger';
import { CreateMentor, CreateUserDto } from './create-user.dto';

export class UpdateMentorsDto extends PartialType(CreateMentor) {}
