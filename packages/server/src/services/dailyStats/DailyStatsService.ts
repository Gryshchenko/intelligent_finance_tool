import { LoggerBase } from 'helper/logger/LoggerBase';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { IDailyStatsDataAccess } from 'services/dailyStats/DailyStatsDataAccess';
import { StatsTransactionType } from 'types/StatsTransactionType';
import { DateFormat, Time } from 'tenpercent/shared';

export interface IDailyStatsService {
    updateTotal: (
        userId: number,
        date: string,
        category: StatsTransactionType,
        amount: number,
        trx?: IDBTransaction,
    ) => Promise<boolean>;
}

export default class DailyStatsService extends LoggerBase implements IDailyStatsService {
    private readonly _dailyStatsDataAccess: IDailyStatsDataAccess;

    public constructor(dailyStatsDataAccess: IDailyStatsDataAccess) {
        super();
        this._dailyStatsDataAccess = dailyStatsDataAccess;
    }

    public async updateTotal(
        userId: number,
        date: string,
        category: StatsTransactionType,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean> {
        const day = Time.formatDate(date, DateFormat.YYYY_MM_DD);
        return await this._dailyStatsDataAccess.updateTotal(userId, day, category, amount, trx);
    }
}
