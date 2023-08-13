import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import process from 'process';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';

const dotenv = require('dotenv');

(async () => {
  const cmd = process.argv[2];

  if (!cmd) {
    throw new Error(
      'Unknown command, available commands are: up, down, list, create',
    );
  }

  dotenv.config();

  const orm = await MikroORM.init({
    host: 'localhost',
    port: parseInt(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: false,
    loadStrategy: LoadStrategy.JOINED,
    highlighter: new SqlHighlighter(),
    metadataProvider: TsMorphMetadataProvider,
    migrations: {
      tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
      path: './migrations', // path to the folder with migrations
      pathTs: undefined, // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
      glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
      transactional: true, // wrap each migration in a transaction
      disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
      allOrNothing: true, // wrap all migrations in master transaction
      dropTables: true, // allow to disable table dropping
      safe: false, // allow to disable table and column dropping
      snapshot: true, // save snapshot when creating new migrations
      emit: 'ts', // migration generation mode
      generator: TSMigrationGenerator,
    },
    type: 'postgresql',
    // @ts-expect-error nestjs adapter option
    registerRequestContext: false,
    extensions: [Migrator, EntityGenerator, SeedManager],
  });

  const migrator = orm.getMigrator();

  switch (cmd) {
    case 'up':
      await migrator.up();
      break;
    case 'down':
      await migrator.down();
      break;
    case 'list':
      const pending = await migrator.getPendingMigrations();
      const executed = await migrator.getExecutedMigrations();
      console.log(
        'Pending migrations:',
        pending.map((m) => m.name),
      );
      console.log(
        'Executed migrations:',
        executed.map((m) => m.name),
      );
      break;
    case 'create':
      await migrator.createMigration();
      break;
    default:
      console.log(
        'Unknown command, available commands are: up, down, list, create',
      );
  }

  await orm.close(true);
})();
