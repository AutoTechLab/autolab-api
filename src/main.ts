import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().addBearerAuth()
    .setTitle('Autolab')
    .setDescription('The Autolab API description')
    .setVersion('1.0')
    .addTag('Autolab')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port || 3000);

  console.log(`Server start on port: ${port}`);
}
bootstrap();
