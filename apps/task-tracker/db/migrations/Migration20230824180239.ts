import { Migration } from '@mikro-orm/migrations';

export class Migration20230824180239 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "task_reward" int null, add column "task_fee" int null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "task_reward";');
    this.addSql('alter table "user" drop column "task_fee";');
  }

}
