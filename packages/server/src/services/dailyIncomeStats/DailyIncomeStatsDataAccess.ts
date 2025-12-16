import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { DBError } from 'src/utils/errors/DBError';

export interface IDailyIncomeStatsDataAccess {
    updateTotal(userId: number, date: string, incomeId: number, amount: number, trx?: IDBTransaction): Promise<boolean>;
}

export class DailyIncomeStatsDataAccess extends LoggerBase implements IDailyIncomeStatsDataAccess {
    constructor(private readonly db: IDatabaseConnection) {
        super();
    }

    async updateTotal(userId: number, date: string, incomeId: number, amount: number, trx?: IDBTransaction): Promise<boolean> {
        const query = trx || this.db.engine();
        try {
            this._logger.info(`Starting update daily income stats userId: ${userId}, date: ${date}`);
            await query.raw(
                `
                INSERT INTO daily_incomes_stats ("userId", date, "incomeId", amount_total)
                VALUES (?, ?::date, ?, ?)
                ON CONFLICT ("userId", date, "incomeId")
                DO UPDATE SET
                    amount_total = daily_incomes_stats.amount_total + EXCLUDED.amount_total,
                    "updatedAt" = NOW();
            `,
                [userId, date, incomeId, amount],
            );

            this._logger.info(`Successfully update daily income stats for userId: ${userId}`);
            return true;
        } catch (e) {
            this._logger.error(
                `Failed update daily income stats for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Update daily income stats failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }
}
