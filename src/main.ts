import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('The store API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        name: 'authorization',
        type: 'apiKey',
        in: 'header',
      },
      'authorization',
    )
    .addBasicAuth({ name: 'basic', in: 'header', type: 'apiKey' })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000, () => {
    console.log(`Server running at port: 🚀🚀🚀 3000 🚀🚀🚀`);
    
  });
}
bootstrap();
