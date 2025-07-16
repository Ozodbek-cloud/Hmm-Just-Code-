import { Module } from '@nestjs/common';
import { MentorProfilesService } from './mentor-profiles.service';
import { MentorProfilesController } from './mentor-profiles.controller';

@Module({
  providers: [MentorProfilesService],
  controllers: [MentorProfilesController]
})
export class MentorProfilesModule {}
