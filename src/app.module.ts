import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'), 
    serveRoot: '/uploads', 
  }),
    ConfigModule],
})
export class AppModule { }


