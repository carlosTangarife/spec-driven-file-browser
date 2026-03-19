/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('File Browser API')
    .setDescription(
      'Directory listing, nested tree, and UTF-8 text preview under FILE_LISTING_ALLOWED_ROOT.',
    )
    .setVersion('1.0')
    .addTag('listing', 'Directory listing and tree')
    .addTag('preview', 'File text preview')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  /** Without `useGlobalPrefix`, UI is mounted at `/docs` only — `/api/docs` would 404. */
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `📚 Swagger UI: http://localhost:${port}/${globalPrefix}/docs`,
  );
}

bootstrap();
