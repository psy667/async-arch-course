import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  RoleChangedV1Event,
  UserCreatedV1Event,
  UserRoleEnum,
  UserUpdatedV1Event,
} from '@app/common/events';
import { UserService } from './services/user.service';
import { TaskTrackerService } from './services/task-tracker.service';

@Injectable()
export class UsersConsumer {
  constructor(
    private readonly userService: UserService,
    private readonly taskTrackerService: TaskTrackerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('auth.user_created.v1')
  async handleUserCreated(payload: UserCreatedV1Event) {
    await this.userService.createUser({
      id: payload.data.user_id,
      name: payload.data.name,
      email: payload.data.email,
      role: payload.data.role,
    });
  }

  @OnEvent('auth.user_updated.v1')
  async handleUserUpdated(payload: UserUpdatedV1Event) {
    await this.userService.updateUser({
      id: payload.data.user_id,
      name: payload.data.name,
      email: payload.data.email,
      role: payload.data.role,
    });
  }

  @OnEvent('auth.role_changed.v1')
  async handleRoleChanged(payload: RoleChangedV1Event) {
    const prevRole = await this.userService
      .findOne(payload.data.user_id)
      .then((user) => user.role);

    if (prevRole === UserRoleEnum.EMPLOYEE) {
      await this.taskTrackerService.reassignUserTasks(payload.data.user_id);
    }
  }
}
