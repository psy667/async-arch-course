import { v4 } from 'uuid';
import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Account } from './account.entity';

@Entity()
export class Transaction {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  credit!: number;

  @Property()
  debit!: number;

  @ManyToOne(() => Account)
  account!: Account;

  @Property()
  description!: string;

  @Property()
  created_at: Date = new Date();
}
