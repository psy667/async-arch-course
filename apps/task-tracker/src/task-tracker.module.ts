import { Module } from '@nestjs/common';
import { TaskTrackerService } from './services/task-tracker.service';
import { TaskTrackerController } from './task-tracker.controller';
import { UsersConsumer } from './users.consumer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoadStrategy } from '@mikro-orm/core';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { KafkaModule } from '@app/common/kafka/kafka.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserCudConsumer } from './users-cud.consumer';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required(),
        HTTP_PORT: Joi.number().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
      }),
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: [User],
        dbName: configService.get<string>('POSTGRES_DB'),
        user: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        type: 'postgresql',
        debug: true,
        loadStrategy: LoadStrategy.JOINED,
        allowGlobalContext: true,
        // highlighter: new SqlHighlighter(),
        // metadataProvider: TsMorphMetadataProvider,
      }),
    }),
    MikroOrmModule.forFeature({ entities: [User, Task] }),
    KafkaModule,
  ],
  controllers: [TaskTrackerController],
  providers: [
    TaskTrackerService,
    UserService,
    UsersConsumer,
    UserCudConsumer,
    JwtStrategy,
  ],
  exports: [TaskTrackerService, UserService],
})
export class TaskTrackerModule {}
