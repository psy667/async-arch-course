import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { TaskStatusEnum } from '@app/common/events';

@Injectable()
export class TaskStreamService {
  constructor(private readonly em: EntityManager) {}

  async taskCreated(data: {
    task_id: string;
    task_description: string;
    task_ticket?: string;
    task_assigned_to: string;
    task_status: TaskStatusEnum;
    task_reward: number;
    task_fee: number;
  }) {
    const task = new Task();
    task.id = data.task_id;
    task.description = data.task_description;
    task.ticket = data.task_ticket;
    task.assigned_to = data.task_assigned_to;
    task.status = data.task_status;
    task.reward = data.task_reward;
    task.fee = data.task_fee;

    await this.em.persistAndFlush(task);
  }

  async taskUpdated(data: {
    task_id: string;
    task_description: string;
    task_ticket?: string;
    task_status: TaskStatusEnum;
    task_assigned_to: string;
    task_reward: number;
    task_fee: number;
  }) {
    const task = await this.em.getRepository(Task).findOne(data.task_id);
    task.description = data.task_description;
    task.ticket = data.task_ticket;
    task.status = data.task_status;
    task.assigned_to = data.task_assigned_to;
    task.reward = data.task_reward;
    task.fee = data.task_fee;

    await this.em.persistAndFlush(task);
  }
}
