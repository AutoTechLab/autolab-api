import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT) || 3000;

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().addBearerAuth()
    .setTitle('Autolab')
    .setDescription('The Autolab API description')
    .setVersion('1.0')
    .addTag('Autolab')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  console.log(`Server start on port: ${port}`);
}
bootstrap();
