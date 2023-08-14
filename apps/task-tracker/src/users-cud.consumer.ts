import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '@app/common/kafka/kafka-consumer.service';
import { EachMessagePayload } from 'kafkajs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersConsumer } from './users.consumer';

@Injectable()
export class UserCudConsumer implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly consumerService: KafkaConsumerService,
    private readonly usersConsumer: UsersConsumer,
  ) {}

  async onModuleInit() {
    this.consumerService.consume(
      { topics: ['users-cud', 'users'], fromBeginning: true },
      { eachMessage: this.handleMessage.bind(this) },
    );
    console.log('UserCudConsumer is initialized');
  }

  async handleMessage(payload: EachMessagePayload) {
    console.log('Received message', {
      event: payload.message.key.toString(),
      value: payload.message.value.toString(),
      topic: payload.topic.toString(),
      partition: payload.partition.toString(),
    });

    if (payload.topic.toString() === 'users') {
      this.usersConsumer.handleMessage(payload);
      return;
    }

    switch (payload.message.key.toString()) {
      case 'user_created':
        await this.handleUserCreated(payload);
        break;
      case 'user_updated':
        await this.handleUserUpdated(payload);
        break;
      case 'user_deleted':
        await this.handleUserDeleted(payload);
        break;
      default:
        break;
    }
  }
  async handleUserCreated(payload: EachMessagePayload) {
    const userDataRaw = JSON.parse(payload.message.value.toString());
    const userDto = new CreateUserDto();

    userDto.id = userDataRaw.id;
    userDto.name = userDataRaw.name;
    userDto.email = userDataRaw.email;
    userDto.role = userDataRaw.role;

    await this.userService.createUser(userDto);
  }

  async handleUserUpdated(payload: EachMessagePayload) {
    const userDataRaw = JSON.parse(payload.message.value.toString());
    const userDto = new UpdateUserDto();

    if (userDataRaw.name) {
      userDto.name = userDataRaw.name;
    }
    if (userDataRaw.email) {
      userDto.email = userDataRaw.email;
    }

    await this.userService.updateUser(userDataRaw.id, userDto);
  }

  async handleUserDeleted(payload: EachMessagePayload) {
    const userDataRaw = JSON.parse(payload.message.value.toString());
    await this.userService.deleteUser(userDataRaw.id);
  }
}
