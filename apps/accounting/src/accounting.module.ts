import { Module } from '@nestjs/common';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './services/accounting.service';
import { KafkaService } from './services/kafka.service';
import { TasksConsumer } from './tasks.consumer';
import { TaskStreamService } from './services/task-stream.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoadStrategy } from '@mikro-orm/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Transaction } from './entities/transaction.entity';
import { Task } from './entities/task.entity';
import { Account } from './entities/account.entity';
import { UsersConsumer } from './users.consumer';
import { KafkaConsumerService } from '@app/common/kafka/kafka-consumer.service';
import { KafkaProducerService } from '@app/common/kafka/kafka-producer.service';

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
        entities: [Task, Account, Transaction],
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
    MikroOrmModule.forFeature({ entities: [Account, Transaction, Task] }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AccountingController],
  providers: [
    AccountingService,
    TasksConsumer,
    TaskStreamService,
    UsersConsumer,
    KafkaService,
    {
      provide: KafkaConsumerService,
      useClass: KafkaConsumerService,
    },
    {
      provide: KafkaProducerService,
      useClass: KafkaProducerService,
    },
  ],
})
export class AccountingModule {}
