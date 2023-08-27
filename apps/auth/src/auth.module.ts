import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthService } from './services/auth.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { UserController } from './user.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
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
        entities: [User],
        dbName: configService.get<string>('POSTGRES_DB'),
        user: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        type: 'postgresql',
        debug: true,
        loadStrategy: LoadStrategy.JOINED,
        // highlighter: new SqlHighlighter(),
        // metadataProvider: TsMorphMetadataProvider,
      }),
    }),
    MikroOrmModule.forFeature({ entities: [User] }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
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
export class AuthModule {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }
}
