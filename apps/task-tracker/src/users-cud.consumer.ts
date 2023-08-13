import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '@app/common/kafka/kafka-consumer.service';
import { EachMessagePayload } from 'kafkajs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserConsumer implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly consumerService: KafkaConsumerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['users-cud'], fromBeginning: true },
      { eachMessage: this.handleMessage.bind(this) },
    );
  }

  async handleMessage(payload: EachMessagePayload) {
    console.log('Received message', {
      event: payload.message.value.toString(),
      value: payload.message.value.toString(),
      topic: payload.topic.toString(),
      partition: payload.partition.toString(),
    });

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
    userDto.name = userDataRaw.name;
    userDto.email = userDataRaw.email;
    userDto.role = userDataRaw.role;

    await this.userService.createUser(userDto);
  }

  async handleUserUpdated(payload: EachMessagePayload) {
    const userDataRaw = JSON.parse(payload.message.value.toString());
    const userDto = new UpdateUserDto();
    userDto.name = userDataRaw.name;
    userDto.email = userDataRaw.email;

    await this.userService.updateUser(userDataRaw.id, userDto);
  }

  async handleUserDeleted(payload: EachMessagePayload) {
    const userDataRaw = JSON.parse(payload.message.value.toString());
    await this.userService.deleteUser(userDataRaw.id);
  }
}
