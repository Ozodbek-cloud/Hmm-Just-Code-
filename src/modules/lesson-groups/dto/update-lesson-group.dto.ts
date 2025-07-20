import { IsNotEmpty, IsString } from "class-validator";

export class UpdateLessonGroupDto  {
    @IsString()
    @IsNotEmpty()
    name: string
}
