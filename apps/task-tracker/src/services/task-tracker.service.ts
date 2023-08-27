import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { EntityManager } from '@mikro-orm/core';
import { Task, TaskStatus } from '../entities/task.entity';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { KafkaProducerService } from '@app/common/kafka/kafka-producer.service';
import {
  TaskAssignedV1Event,
  TaskCompletedV1Event,
  TaskCreatedV1Event,
  TaskCreatedV2Event,
  TaskStatusEnum,
  TaskUpdatedV1Event,
  TaskUpdatedV2Event,
} from '@app/common/events';

@Injectable()
export class TaskTrackerService {
  constructor(
    private userService: UserService,
    private entityManager: EntityManager,
    private kafkaProducerService: KafkaProducerService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = new Task();
    task.description = createTaskDto.description;
    task.status = TaskStatus.OPEN;
    task.assignedTo = await this.userService.selectRandomEmployee();
    task.reward = this.calculateReward();
    task.fee = this.calculateFee();
    task.createdBy = user;
    await this.entityManager.persistAndFlush(task);

    await this.kafkaProducerService.produceEvent<TaskCreatedV2Event>(
      'task_tracker',
      {
        event_name: 'task_tracker.task_created',
        producer: 'task_tracker',
        event_version: 2,
        data: {
          task_id: task.id,
          task_description: task.description,
          task_assigned_to: task.assignedTo.id,
          task_ticket: task.ticket,
          task_status: task.status as unknown as TaskStatusEnum,
          task_fee: task.fee,
          task_reward: task.reward,
        },
      },
    );

    await this.kafkaProducerService.produceEvent<TaskAssignedV1Event>(
      'task_tracker',
      {
        event_name: 'task_tracker.task_assigned',
        producer: 'task_tracker',
        event_version: 1,
        data: {
          task_id: task.id,
          assigned_to: task.assignedTo.id,
        },
      },
    );
    return task;
  }

  async reassignTasks() {
    const tasks = await this.entityManager.getRepository(Task).findAll();

    for (const task of tasks) {
      const randomUser = await this.userService.selectRandomEmployee();

      task.assignedTo = randomUser;
      console.log({ assignedTo: task.assignedTo });

      await this.kafkaProducerService
        .produceEvent<TaskUpdatedV2Event>('task_tracker', {
          event_name: 'task_tracker.task_updated',
          producer: 'task_tracker',
          event_version: 2,
          data: {
            task_id: task.id,
            task_description: task.description,
            task_ticket: task.ticket,
            task_status: task.status as unknown as TaskStatusEnum,
            task_assigned_to: task.assignedTo.id,
            task_fee: task.fee,
            task_reward: task.reward,
          },
        })
        .then();

      this.kafkaProducerService
        .produceEvent<TaskAssignedV1Event>('task_tracker', {
          event_name: 'task_tracker.task_assigned',
          producer: 'task_tracker',
          event_version: 1,
          data: {
            task_id: task.id,
            assigned_to: task.assignedTo.id,
          },
        })
        .then((r) => r);
    }

    await this.entityManager.persistAndFlush(tasks);
  }

  findAll() {
    // load all tasks with their assignedTo
    return this.entityManager.find(
      Task,
      {},
      {
        populate: ['assignedTo', 'createdBy'],
        orderBy: { createdAt: 'DESC' },
      },
    );
  }

  findMyTasks(user: User) {
    return this.entityManager.find(Task, {
      createdBy: user,
    });
  }

  async completeTask(taskId: string) {
    const task = await this.entityManager
      .getRepository(Task)
      .findOneOrFail(taskId);
    task.status = TaskStatus.DONE;
    await this.entityManager.persistAndFlush(task);

    await this.kafkaProducerService.produceEvent<TaskUpdatedV2Event>(
      'task_tracker',
      {
        event_name: 'task_tracker.task_updated',
        producer: 'task_tracker',
        event_version: 2,
        data: {
          task_id: task.id,
          task_description: task.description,
          task_ticket: task.ticket,
          task_status: task.status as unknown as TaskStatusEnum,
          task_assigned_to: task.assignedTo.id,
          task_fee: task.fee,
          task_reward: task.reward,
        },
      },
    );

    await this.kafkaProducerService.produceEvent<TaskCompletedV1Event>(
      'task_tracker',
      {
        event_name: 'task_tracker.task_completed',
        producer: 'task_tracker',
        event_version: 1,
        data: {
          task_id: task.id,
        },
      },
    );
  }

  async reassignUserTasks(id: string) {
    const assignedTasks = await this.entityManager
      .getRepository(Task)
      .find({ assignedTo: id });

    for (const task of assignedTasks) {
      const randomUser = await this.userService.selectRandomEmployee();

      task.assignedTo = randomUser;

      console.log({ assignedTo: task.assignedTo });

      this.kafkaProducerService
        .produceEvent<TaskUpdatedV2Event>('task_tracker', {
          event_name: 'task_tracker.task_updated',
          producer: 'task_tracker',
          event_version: 2,
          data: {
            task_id: task.id,
            task_description: task.description,
            task_ticket: task.ticket,
            task_status: task.status as unknown as TaskStatusEnum,
            task_assigned_to: task.assignedTo.id,
            task_fee: task.fee,
            task_reward: task.reward,
          },
        })
        .then();

      this.kafkaProducerService
        .produceEvent<TaskAssignedV1Event>('task_tracker', {
          event_name: 'task_tracker.task_assigned',
          producer: 'task_tracker',
          event_version: 1,
          data: {
            task_id: task.id,
            assigned_to: task.assignedTo.id,
          },
        })
        .then();
    }

    await this.entityManager.persistAndFlush(assignedTasks);
  }

  private calculateReward() {
    return 20 + Math.round(Math.random() * 20);
  }

  private calculateFee() {
    return 10 + Math.round(Math.random() * 10);
  }
}
