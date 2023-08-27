import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

export enum TaskStatus {
  OPEN = 'open',
  DONE = 'done',
}
@Entity()
export class Task {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  description: string;

  @Property({ nullable: true })
  ticket: string;

  @Property()
  status: TaskStatus;

  @Property({ type: 'numeric(10, 2)' })
  reward: number;

  @Property({ type: 'numeric(10, 2)' })
  fee: number;

  @ManyToOne(() => User)
  assignedTo: User;

  @ManyToOne(() => User)
  createdBy: User;

  @Property({ default: 'now()' })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), default: 'now()' })
  updatedAt = new Date();

  @Property({ nullable: true })
  completedAt?: Date;

  @Property({ nullable: true })
  completedBy?: User;
}
