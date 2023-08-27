import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Task {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property()
  description: string;

  @Property({ nullable: true })
  ticket: string;

  @Property()
  status: string;

  @Property()
  assigned_to: string;

  @Property({ type: 'numeric(10, 2)' })
  reward: number;

  @Property({ type: 'numeric(10, 2)' })
  fee: number;

  @Property({ default: 'now()' })
  created_at = new Date();

  @Property({ onUpdate: () => new Date(), default: 'now()' })
  updated_at = new Date();
}
