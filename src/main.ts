import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/config/swagger.set-up';
import * as dotenv from "dotenv"

dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())

  await setupSwagger(app)

  await app.listen(process.env.PORT ?? 4000, () => console.log(`Running on ${process.env.PORT}`));
}

bootstrap();
