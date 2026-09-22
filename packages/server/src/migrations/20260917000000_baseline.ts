import { Knex } from 'knex';

export async function up(_knex: Knex): Promise<void> {
    // Intentionally empty - the baseline schema is not managed by knex.
}

export async function down(_knex: Knex): Promise<void> {
    // Intentionally empty - there is nothing before the baseline to return to.
}
