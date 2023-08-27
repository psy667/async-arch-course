import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Transaction } from './transaction.entity';

@Entity()
export class Account {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  user_id!: string;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions = new Array<Transaction>();

  @Property()
  created_at: Date = new Date();
}
