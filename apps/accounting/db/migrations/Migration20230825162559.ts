import { Migration } from '@mikro-orm/migrations';

export class Migration20230825162559 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "task" add column "reward" numeric(10,0) not null, add column "fee" numeric(10,0) not null;');
    this.addSql('alter table "task" drop column "task_reward";');
    this.addSql('alter table "task" drop column "task_fee";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "task" add column "task_reward" int null, add column "task_fee" int null;');
    this.addSql('alter table "task" drop column "reward";');
    this.addSql('alter table "task" drop column "fee";');
  }

}
