import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property({ type: 'text' })
  role: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks = [];

  @OneToMany(() => Task, (task) => task.createdBy)
  createdTasks = [];
}
