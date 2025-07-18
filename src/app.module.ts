import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LastActivityModule } from './modules/last-activity/last-activity.module';
import { CategoryRatingModule } from './modules/category-rating/category-rating.module';


@Module({
  imports: [ConfigModule, LastActivityModule, CategoryRatingModule],
})
export class AppModule {}
