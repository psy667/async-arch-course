import { Migration } from '@mikro-orm/migrations';

export class Migration20230825162619 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "task" add column "reward" numeric(10,0) not null, add column "fee" numeric(10,0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "task" drop column "reward";');
    this.addSql('alter table "task" drop column "fee";');
  }

}
