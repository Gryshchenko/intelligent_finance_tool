import { DBError } from 'src/utils/errors/DBError';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';

export interface IDailyCategoryStatsDataAccess {
    updateTotal(userId: number, date: string, categoryId: number, amount: number, trx?: IDBTransaction): Promise<boolean>;
}

export class DailyCategoryStatsDataAccess extends LoggerBase implements IDailyCategoryStatsDataAccess {
    constructor(private readonly db: IDatabaseConnection) {
        super();
    }

    async updateTotal(userId: number, date: string, categoryId: number, amount: number, trx?: IDBTransaction): Promise<boolean> {
        try {
            const query = trx || this.db.engine();
            this._logger.info(`Starting update daily category stats userId: ${userId}, date: ${date}`);
            await query.raw(
                `
                INSERT INTO daily_categories_stats ("userId", date, "categoryId", amount_total)
                VALUES (?, ?::date, ?, ?)
                ON CONFLICT ("userId", date, "categoryId")
                DO UPDATE SET
                    amount_total = daily_categories_stats.amount_total + EXCLUDED.amount_total,
                    "updatedAt" = NOW();
                `,
                [userId, date, categoryId, amount],
            );

            this._logger.info(`Successfully update daily category stats for userId: ${userId}`);
            return true;
        } catch (e) {
            this._logger.error(
                `Failed update daily category stats for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Update daily category stats failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }
}
