import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MentorProfilesModule } from 'src/modules/mentor-profiles/mentor-profiles.module';
import { VerificationModule } from 'src/modules/verification/verification.module';
import { SeedersModule } from 'src/core/seeders/seeders.module';
import { CourseCategoryModule } from 'src/modules/course-category/course-category.module';
import { ProfilesModule} from 'src/modules/profiles/profile.module';
import { LastActivityModule } from 'src/modules/last-activity/last-activity.module';
import { CategoryRatingModule } from 'src/modules/category-rating/category-rating.module';
import { LessonsModule } from 'src/modules/lessons/lessons.module';
import { LessonGroupsModule } from 'src/modules/lesson-groups/lesson-groups.module';
import { LessonFileModule } from 'src/modules/lesson-file/lesson-file.module';
import { ExamModule } from 'src/modules/exam/exam.module';
import { CourseModule } from 'src/modules/course/course.module';
import { HomeworksModule } from 'src/modules/homeworks/homeworks.module';
import { QuestionsAnswersModule } from 'src/modules/questions-answers/questions-answers.module';
import { PurchasedCoursesModule } from 'src/modules/purchased-courses/purchased-courses.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { ContactModule } from 'src/modules/contact/contact.module';

@Module({
    imports: [JwtModule, MailModule, RedisModule, PrismaModule, AuthModule, MentorProfilesModule, VerificationModule, ProfilesModule, UsersModule, CourseCategoryModule
        , LastActivityModule, CategoryRatingModule, LessonsModule, LessonGroupsModule, LessonFileModule, ExamModule, CourseModule, HomeworksModule, QuestionsAnswersModule, PurchasedCoursesModule, PaymentModule, ContactModule
    ]
})

export class ConfigModule { }
