import { Migration } from '@mikro-orm/migrations';

export class Migration20230824181346 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "account" ("id" uuid not null, "user_id" varchar(255) not null, "created_at" timestamptz(0) not null, constraint "account_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "task" ("id" uuid not null, "description" varchar(255) not null, "status" varchar(255) not null, "assigned_to" varchar(255) not null, "task_reward" int null, "task_fee" int null, "created_at" timestamptz(0) not null default \'now()\', "updated_at" timestamptz(0) not null default \'now()\', constraint "task_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "transaction" ("id" uuid not null, "credit" int not null, "debit" int not null, "account_id" uuid not null, "description" varchar(255) not null, "created_at" timestamptz(0) not null, constraint "transaction_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "transaction" add constraint "transaction_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "transaction" drop constraint "transaction_account_id_foreign";',
    );

    this.addSql('drop table if exists "account" cascade;');

    this.addSql('drop table if exists "task" cascade;');

    this.addSql('drop table if exists "transaction" cascade;');
  }
}
