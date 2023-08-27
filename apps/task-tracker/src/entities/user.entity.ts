import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property({ type: 'text' })
  role: string;

  @Property()
  createdAt = new Date();

  @Property({ nullable: true })
  task_reward: number;

  @Property({ nullable: true })
  task_fee: number;

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks = [];

  @OneToMany(() => Task, (task) => task.createdBy)
  createdTasks = [];
}
