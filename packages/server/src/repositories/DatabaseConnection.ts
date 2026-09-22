import knex, { Knex } from 'knex';

import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { IPgConnectionSettings, pgConnection } from 'src/repositories/pgConnection';

export default class DatabaseConnection implements IDatabaseConnection {
    private readonly _db: Knex;

    private static _inspect: IDatabaseConnection;

    public static instance(config: IPgConnectionSettings): IDatabaseConnection {
        return DatabaseConnection._inspect || (DatabaseConnection._inspect = new DatabaseConnection(config));
    }

    public constructor(config: IPgConnectionSettings) {
        this._db = knex({
            client: 'pg',
            connection: pgConnection(config),
            pool: {
                min: 1,
                max: 20,
            },
        });
    }

    public engine(): Knex {
        try {
            return this._db;
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async close(): Promise<void> {
        await this._db.destroy();
    }
    public async transaction(): Promise<IDBTransaction> {
        return await this._db.transaction();
    }
}
