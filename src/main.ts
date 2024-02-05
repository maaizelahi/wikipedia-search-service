import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import csurf from 'csurf';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middlewares
  app.use(helmet());
  // app.use(csurf());
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );
  // Enable CORS
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Wikipedia Search API')
    .setDescription('API for the Wikipedia Search Tool')
    .setVersion('1.0')
    .addBearerAuth() // Add this line for authentication
    .build();

  const document = SwaggerModule.createDocument(app, options);
  // Write Swagger JSON to a file
  await writeFile('docs/swagger.json', JSON.stringify(document, null, 2));

  // Setup Swagger UI
  SwaggerModule.setup('docs', app, document);

  await app.listen(3333);
}
bootstrap();
