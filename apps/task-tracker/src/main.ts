import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { TaskTrackerModule } from './task-tracker.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(TaskTrackerModule);
  const configService = app.get(ConfigService);

  // app.connectMicroservice({
  //     transport: Transport.TCP,
  //     options: {
  //         host: '0.0.0.0',
  //         port: configService.get('TCP_PORT'),
  //     },
  // });
  const config = new DocumentBuilder()
    .setTitle('ATES Core')
    .setDescription('The Awesome Task Tracker API description')
    .setVersion('v1')
    .addBearerAuth()
    .addTag('popug')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // app.useLogger(app.get(Logger));

  const port = configService.get('HTTP_PORT');

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
