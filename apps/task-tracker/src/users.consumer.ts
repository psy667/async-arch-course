import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { UserService } from './services/user.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { TaskTrackerService } from './services/task-tracker.service';
import { UserRoleEnum } from './models/user-role.enum';

@Injectable()
export class UsersConsumer {
  constructor(
    private readonly userService: UserService,
    private readonly taskTrackerService: TaskTrackerService,
  ) {}

  // Consumer init in UsersCudConsumer

  async handleMessage(payload: EachMessagePayload) {
    console.log('Received message', {
      event: payload.message.key.toString(),
      value: payload.message.value.toString(),
      topic: payload.topic.toString(),
      partition: payload.partition.toString(),
    });

    switch (payload.message.key.toString()) {
      case 'user_role_updated':
        await this.handleRoleChange(payload);
        break;
      default:
        break;
    }
  }
  async handleRoleChange(payload: EachMessagePayload) {
    const userDataRaw = JSON.parse(payload.message.value.toString());

    const changeRoleDto = new ChangeRoleDto();
    changeRoleDto.role = userDataRaw.newRole;
    changeRoleDto.userId = userDataRaw.id;

    const prevRole = await this.userService
      .findOne(changeRoleDto.userId)
      .then((user) => user.role);

    if (prevRole === UserRoleEnum.EMPLOYEE) {
      await this.taskTrackerService.reassignUserTasks(changeRoleDto.userId);
    }

    await this.userService.changeRole(changeRoleDto);
  }
}
