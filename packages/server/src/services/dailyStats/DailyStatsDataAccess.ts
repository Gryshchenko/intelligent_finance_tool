import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { StatsTransactionType } from 'types/StatsTransactionType';
import { DBError } from 'src/utils/errors/DBError';

export interface IDailyStatsDataAccess {
    updateTotal: (
        userId: number,
        date: string,
        category: StatsTransactionType,
        amount: number,
        trx?: IDBTransaction,
    ) => Promise<boolean>;
}

export default class DailyStatsDataAccess extends LoggerBase implements IDailyStatsDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }

    public async updateTotal(
        userId: number,
        date: string,
        category: StatsTransactionType,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean> {
        try {
            this._logger.info(`Starting update daily stats userId: ${userId}, date: ${date}`);

            const query = trx || this._db.engine();
            await query.raw(
                `
                    INSERT INTO daily_stats ("userId", date, income_total, expense_total, transfer_total)
                    VALUES (?, ?::date,
                            CASE WHEN ? = 'income' THEN ? ELSE 0::numeric END,
                            CASE WHEN ? = 'expense' THEN ? ELSE 0::numeric END,
                            CASE WHEN ? = 'transfer' THEN ? ELSE 0::numeric END)
                    ON CONFLICT ("userId", date)
                    DO UPDATE SET
                        income_total = daily_stats.income_total + CASE WHEN EXCLUDED.income_total   <> 0 THEN EXCLUDED.income_total   ELSE 0 END,
                        expense_total  = daily_stats.expense_total + CASE WHEN EXCLUDED.expense_total  <> 0 THEN EXCLUDED.expense_total  ELSE 0 END,
                        transfer_total  = daily_stats.transfer_total + CASE WHEN EXCLUDED.transfer_total  <> 0 THEN EXCLUDED.transfer_total  ELSE 0 END,
                        "updatedAt" = NOW();
        `,
                [userId, date, category, amount, category, amount, category, amount],
            );
            this._logger.info(`Successfully update daily stats for userId: ${userId}`);
            return true;
        } catch (e) {
            this._logger.error(`Failed update daily stats for userId: ${userId}. Error: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Update daily stats failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }
}
