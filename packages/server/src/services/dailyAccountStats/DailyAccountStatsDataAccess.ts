import { StatsTransactionType } from 'types/StatsTransactionType';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { DBError } from 'src/utils/errors/DBError';

export interface IDailyAccountStatsDataAccess {
    updateTotal(
        userId: number,
        date: string,
        accountId: number,
        type: StatsTransactionType,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean>;
}

export class DailyAccountStatsDataAccess extends LoggerBase implements IDailyAccountStatsDataAccess {
    constructor(private readonly db: IDatabaseConnection) {
        super();
    }

    async updateTotal(
        userId: number,
        date: string,
        accountId: number,
        type: StatsTransactionType,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean> {
        try {
            const query = trx || this.db.engine();
            this._logger.info(`Starting update daily account stats userId: ${userId}, date: ${date}`);
            await query.raw(
                `
            INSERT INTO daily_accounts_stats (
                "userId", date, "accountId", income_total, expense_total
            )
            VALUES (
                ?, ?::date, ?,
                CASE WHEN ? = 'income' THEN ? ELSE 0 END,
                CASE WHEN ? = 'expense' THEN ? ELSE 0 END
            )
            ON CONFLICT ("userId", date, "accountId")
            DO UPDATE SET
                income_total  = daily_accounts_stats.income_total  + EXCLUDED.income_total,
                expense_total = daily_accounts_stats.expense_total + EXCLUDED.expense_total,
                "updatedAt" = NOW();
            `,
                [userId, date, accountId, type, amount, type, amount],
            );
            this._logger.info(`Successfully update daily account stats for userId: ${userId}`);
            return true;
        } catch (e) {
            this._logger.error(
                `Failed update daily account stats for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Update daily account stats failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }
}
