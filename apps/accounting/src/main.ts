import { NestFactory } from '@nestjs/core';
import { AccountingModule } from './accounting.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AccountingModule);
  const configService = app.get(ConfigService);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('ATES Accounting')
    .setDescription('The Awesome Task Tracker API description')
    .setVersion('v1')
    .addBearerAuth()
    .addTag('popug')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // app.useLogger(app.get(Logger));

  const port = configService.get('HTTP_PORT');

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
