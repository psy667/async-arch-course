import { Migration } from '@mikro-orm/migrations';

export class Migration20230811201707 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" alter column "id" drop default;');
    this.addSql(
      'alter table "user" alter column "id" type uuid using ("id"::text::uuid);',
    );
    this.addSql(
      'alter table "user" alter column "id" set default uuid_generate_v4();',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "id" drop default;');
    this.addSql('alter table "user" alter column "id" drop default;');
    this.addSql(
      'alter table "user" alter column "id" type uuid using ("id"::text::uuid);',
    );
  }
}
