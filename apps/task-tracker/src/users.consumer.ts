import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '@app/common/kafka/kafka-consumer.service';
import { EachMessagePayload } from 'kafkajs';
import { UserService } from './services/user.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { TaskTrackerService } from './services/task-tracker.service';

@Injectable()
export class UsersConsumer implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly consumerService: KafkaConsumerService,
    private readonly taskTrackerService: TaskTrackerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['users'], fromBeginning: true },
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
      case 'user_role_changed':
        await this.handleRoleChange(payload);
        break;
      default:
        break;
    }
  }
  async handleRoleChange(payload: EachMessagePayload) {
    const userDataRaw = JSON.parse(payload.message.value.toString());

    const changeRoleDto = new ChangeRoleDto();
    changeRoleDto.role = userDataRaw.role;
    changeRoleDto.userId = userDataRaw.user;

    if (userDataRaw.role === 'employee') {
      await this.taskTrackerService.reassignUserTasks(changeRoleDto.userId);
    }

    await this.userService.changeRole(changeRoleDto);
  }
}
