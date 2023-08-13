import { Migration } from '@mikro-orm/migrations';

export class Migration20230812105636 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "role" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint "user_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }
}
