// Applies schema migrations from src/migrations. Runs as its own deploy step, before the
// server starts - never from app.ts, so parallel instances cannot race each other.
//
//   dev:  pnpm migrate [latest|rollback|status]
//   prod: node dist/src/migrate.js [latest|rollback|status]
//
// The baseline schema (docker/local/db/schema.sql) is loaded once with psql; migrations
// only describe changes made after it.

import { readdirSync } from 'fs';
import knex, { Knex } from 'knex';
import path from 'path';

import dbConfig from 'src/config/dbConfig';
import { pgConnection } from 'src/repositories/pgConnection';

type Command = 'latest' | 'rollback' | 'status';

const COMMANDS: Command[] = ['latest', 'rollback', 'status'];

// ts-node runs the .ts sources; the built image only has the compiled .js files.
const EXTENSION = path.extname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

/**
 * Knex's default source records the file name with its extension, so a database migrated by
 * the build (`x.js`) reports `x.ts` as missing under ts-node, and vice versa. Recording the
 * bare name keeps knex_migrations identical whichever way the migrations were run.
 */
const migrationSource: Knex.MigrationSource<string> = {
    getMigrations: async () =>
        readdirSync(MIGRATIONS_DIR)
            .filter((file) => path.extname(file) === EXTENSION && !file.endsWith('.d.ts'))
            .sort(),
    getMigrationName: (file) => path.basename(file, EXTENSION),
    getMigration: async (file) => import(path.join(MIGRATIONS_DIR, file)),
};

const migratorConfig: Knex.MigratorConfig = {
    migrationSource,
    tableName: 'knex_migrations',
};

function createKnex(): Knex {
    return knex({
        client: 'pg',
        connection: pgConnection(dbConfig),
        pool: {
            min: 1,
            max: 1,
            // Fail fast instead of queueing behind a long-running query holding the table lock.
            afterCreate: (
                conn: { query: (sql: string, cb: (err: Error | null) => void) => void },
                done: (err: Error | null, conn: unknown) => void,
            ) => {
                conn.query("SET lock_timeout = '10s'", (err) => done(err, conn));
            },
        },
    });
}

async function run(db: Knex, command: Command): Promise<void> {
    switch (command) {
        case 'latest': {
            const [batch, applied] = await db.migrate.latest(migratorConfig);
            console.log(applied.length ? `Batch ${batch} applied:\n  ${applied.join('\n  ')}` : 'Already up to date');
            return;
        }
        case 'rollback': {
            const [batch, reverted] = await db.migrate.rollback(migratorConfig);
            console.log(reverted.length ? `Batch ${batch} rolled back:\n  ${reverted.join('\n  ')}` : 'Nothing to roll back');
            return;
        }
        case 'status': {
            const [completed, pending] = await db.migrate.list(migratorConfig);
            console.log(`Applied (${completed.length}):`);
            completed.forEach((m: { name: string }) => console.log(`  ${m.name}`));
            console.log(`Pending (${pending.length}):`);
            pending.forEach((file: string) => console.log(`  ${path.basename(file, EXTENSION)}`));
            return;
        }
    }
}

async function main(): Promise<void> {
    const command = (process.argv[2] ?? 'latest') as Command;
    if (!COMMANDS.includes(command)) {
        throw new Error(`Unknown command "${command}". Use one of: ${COMMANDS.join(', ')}`);
    }

    console.log(
        `[migrate] ${command} on ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database} (ssl=${dbConfig.ssl}, auth=${dbConfig.iamAuth ? 'iam' : 'password'})`,
    );

    const db = createKnex();
    try {
        await run(db, command);
    } finally {
        await db.destroy();
    }
}

main().catch((error) => {
    console.error('[migrate] failed:', error);
    process.exit(1);
});
