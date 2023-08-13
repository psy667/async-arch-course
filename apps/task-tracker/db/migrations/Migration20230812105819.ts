import { Migration } from '@mikro-orm/migrations';

export class Migration20230812105819 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "task" ("id" uuid not null, "assigned_to_id" uuid not null, "created_by_id" uuid not null, constraint "task_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "task" add constraint "task_assigned_to_id_foreign" foreign key ("assigned_to_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "task" add constraint "task_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "task" cascade;');
  }
}
