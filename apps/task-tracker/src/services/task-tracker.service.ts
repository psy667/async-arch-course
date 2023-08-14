import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { EntityManager } from '@mikro-orm/core';
import { Task, TaskStatus } from '../entities/task.entity';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

@Injectable()
export class TaskTrackerService {
  constructor(
    private userService: UserService,
    private entityManager: EntityManager,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = new Task();
    task.description = createTaskDto.description;
    task.status = TaskStatus.OPEN;
    task.assignedTo = await this.userService.selectRandomEmployee();
    task.createdBy = user;
    await this.entityManager.persistAndFlush(task);
    return task;
  }

  async reassignTasks() {
    const tasks = await this.entityManager.getRepository(Task).findAll();

    for (const task of tasks) {
      task.assignedTo = await this.userService.selectRandomEmployee();
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
  }

  async reassignUserTasks(id: string) {
    const assignedTasks = await this.entityManager
      .getRepository(Task)
      .find({ assignedTo: id });

    for (const task of assignedTasks) {
      task.assignedTo = await this.userService.selectRandomEmployee();
    }

    await this.entityManager.persistAndFlush(assignedTasks);
  }
}
