import { Migration } from '@mikro-orm/migrations';

export class Migration20230812212238 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "task" add column "created_at" timestamptz(0) not null default \'now()\', add column "updated_at" timestamptz(0) not null default \'now()\', add column "completed_at" timestamptz(0) null, add column "completed_by" varchar(255) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "task" drop column "created_at";');
    this.addSql('alter table "task" drop column "updated_at";');
    this.addSql('alter table "task" drop column "completed_at";');
    this.addSql('alter table "task" drop column "completed_by";');
  }
}
