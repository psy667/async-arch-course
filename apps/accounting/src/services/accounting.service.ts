import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { Account } from '../entities/account.entity';
import { Task } from '../entities/task.entity';
import { UserRoleEnum } from '@app/common/events';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AccountingService {
  constructor(private readonly em: EntityManager) {}
  async taskAssigned(payload: { task_id: string; assigned_to: string }) {
    const task = await this.em.getRepository(Task).findOne(payload.task_id);

    const account = await this.em
      .getRepository(Account)
      .findOne({ user_id: payload.assigned_to });

    const transaction = new Transaction();

    transaction.account = account;
    transaction.debit = task.fee;
    transaction.credit = 0;
    transaction.description = `Task ${task.id} assigned to ${task.assigned_to}`;

    await this.em.persistAndFlush(transaction);
  }

  async taskCompleted(payload: { task_id: string }) {
    const task = await this.em.getRepository(Task).findOne(payload.task_id);

    const account = await this.em
      .getRepository(Account)
      .findOne({ user_id: task.assigned_to });

    const transaction = new Transaction();

    transaction.account = account;
    transaction.debit = 0;
    transaction.credit = task.reward;
    transaction.description = `Task ${task.id} completed by ${task.assigned_to}`;

    await this.em.persistAndFlush(transaction);
  }

  async getBalance(accountId: string) {
    const account = await this.em.getRepository(Account).findOne(accountId);

    return this.em
      .getRepository(Transaction)
      .find({
        account,
      })
      .then((transactions) =>
        transactions.reduce((acc, transaction) => {
          return acc + transaction.credit - transaction.debit;
        }, 0),
      )
      .then((balance) => ({ accountId: accountId, balance }));
  }

  async getTransactions(accountId: string) {
    const transactions = await this.em.getRepository(Transaction).find({
      account: accountId,
    });
    return {
      accountId,
      transactions,
    };
  }

  async getAllTransactions() {
    const transactions = await this.em.getRepository(Transaction).findAll();
    return {
      transactions,
    };
  }

  async createAccount(user: {
    user_id: string;
    email: string;
    name: string;
    role: UserRoleEnum;
  }) {
    const userEntity = this.em.getRepository(Account).create({
      user_id: user.user_id,
    });

    await this.em.persistAndFlush(userEntity);
  }

  async payoutForAccount(account_id: string) {
    const account = await this.em.getRepository(Account).findOne(account_id);

    const accountBalance = await this.getBalance(account_id);

    if (accountBalance.balance <= 0) {
      return;
    }

    const transaction = new Transaction();

    transaction.account = account;
    transaction.debit = accountBalance.balance;
    transaction.credit = 0;
    transaction.description = `Payout to ${account.user_id}`;

    await this.em.persistAndFlush(transaction);
  }

  @Cron('0 30 11 * * 1-5')
  async payoutForAllAccounts() {
    const accounts = await this.em.getRepository(Account).findAll();

    for (const account of accounts) {
      await this.payoutForAccount(account.id);
    }
  }
}
