import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LastActivityModule } from './modules/last-activity/last-activity.module';
import { CategoryRatingModule } from './modules/category-rating/category-rating.module';
import { LessonsModule } from './modules/lessons/lessons.module';


@Module({
  imports: [ConfigModule, LastActivityModule, CategoryRatingModule, LessonsModule],
})
export class AppModule {}
