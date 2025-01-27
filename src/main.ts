import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Excange skills documentations')
    .setDescription('The exchange skills API description')
    .setVersion('1.0')
    .addBearerAuth() // Добавляем поддержку Bearer токенов
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Создаём папку uploads при запуске, если её нет
  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
