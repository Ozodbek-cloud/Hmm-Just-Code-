import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LastActivityModule } from './modules/last-activity/last-activity.module';
import { CategoryRatingModule } from './modules/category-rating/category-rating.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { LessonGroupsModule } from './modules/lesson-groups/lesson-groups.module';
import { LessonFileModule } from './modules/lesson-file/lesson-file.module';
import { ExamModule } from './modules/exam/exam.module';
import { UsersModule } from './modules/users/users.module';
import { CourseModule } from './modules/course/course.module';
import { HomeworksModule } from './modules/homeworks/homeworks.module';
import { QuestionsAnswersModule } from './modules/questions-answers/questions-answers.module';
import { PurchasedCoursesModule } from './modules/purchased-courses/purchased-courses.module';


@Module({
  imports: [ConfigModule, LastActivityModule, CategoryRatingModule, LessonsModule, LessonGroupsModule, LessonFileModule, ExamModule, UsersModule, CourseModule, HomeworksModule, QuestionsAnswersModule, PurchasedCoursesModule],
})
export class AppModule {}


