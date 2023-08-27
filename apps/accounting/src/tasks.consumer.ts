import { OnEvent } from '@nestjs/event-emitter';
import { AccountingService } from './services/accounting.service';
import {
  EventNameAndVersion,
  TaskAssignedV1Event,
  TaskCompletedV1Event,
  TaskCreatedV1Event,
  TaskUpdatedV1Event,
} from '@app/common/events';
import { Injectable } from '@nestjs/common';
import { TaskStreamService } from './services/task-stream.service';

@Injectable()
export class TasksConsumer {
  constructor(
    private readonly accountingService: AccountingService,
    private readonly taskStreamService: TaskStreamService,
  ) {}

  @OnEvent('task_tracker.task_created.v1' satisfies EventNameAndVersion)
  async handleTaskCreated(payload: TaskCreatedV1Event) {
    await this.taskStreamService.taskCreated(payload.data);
  }

  @OnEvent('task_tracker.task_updated.v1' satisfies EventNameAndVersion)
  async handleTaskUpdated(payload: TaskUpdatedV1Event) {
    await this.taskStreamService.taskUpdated(payload.data);
  }

  @OnEvent('task_tracker.task_created.v2' satisfies EventNameAndVersion)
  async handleTaskCreatedV2(payload: TaskCreatedV1Event) {
    await this.taskStreamService.taskCreated(payload.data);
  }

  @OnEvent('task_tracker.task_updated.v2' satisfies EventNameAndVersion)
  async handleTaskUpdatedV2(payload: TaskUpdatedV1Event) {
    await this.taskStreamService.taskUpdated(payload.data);
  }

  @OnEvent('task_tracker.task_assigned.v1' satisfies EventNameAndVersion)
  async handleTaskAssigned(payload: TaskAssignedV1Event) {
    await this.accountingService.taskAssigned(payload.data);
  }

  @OnEvent('task_tracker.task_completed.v1' satisfies EventNameAndVersion)
  async handleTaskCompleted(payload: TaskCompletedV1Event) {
    await this.accountingService.taskCompleted(payload.data);
  }
}
