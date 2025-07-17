import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { VerificationModule } from './modules/verification/verification.module';
import { UsersModule } from './modules/users/users.module';
import { CourseCategoryModule } from './modules/course-category/course-category.module';


@Module({
  imports: [ConfigModule, UsersModule, CourseCategoryModule],
})
export class AppModule {}
