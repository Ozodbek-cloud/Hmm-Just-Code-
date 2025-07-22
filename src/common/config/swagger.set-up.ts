import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Learning Management Platform')
    .setDescription('The Learning API description')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Verification')
    .addTag('Mentor Profiles')
    .addTag('Profiles')
    .addTag('Courses')
    .addTag('Course Categories')
    .addTag('Category Ratings')
    .addTag('Lessons')
    .addTag('Lesson Groups')
    .addTag('Lesson Files')
    .addTag('Exam')
    .addTag('Users')
    // .addTag('Lesson Files')
    // .addTag('Lesson Files')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api_ozodbek_swagger', app, document);
}