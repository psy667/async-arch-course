import { Migration } from '@mikro-orm/migrations';

export class Migration20230812122145 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "task" add column "description" varchar(255) not null, add column "status" varchar(255) not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "task" drop column "description";');
    this.addSql('alter table "task" drop column "status";');
  }
}
