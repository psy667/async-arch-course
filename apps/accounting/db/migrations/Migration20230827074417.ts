import { Migration } from '@mikro-orm/migrations';

export class Migration20230827074417 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "task" add column "ticket" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "task" drop column "ticket";');
  }

}
