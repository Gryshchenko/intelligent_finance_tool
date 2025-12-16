import { LoggerBase } from 'helper/logger/LoggerBase';
import { DateFormat, Time } from 'src/utils/time/Time';
import { IDailyAccountStatsDataAccess } from 'services/dailyAccountStats/DailyAccountStatsDataAccess';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { StatsTransactionType } from 'types/StatsTransactionType';

export interface IDailyAccountStatsService {
    updateTotal(
        userId: number,
        date: string,
        accountId: number,
        type: StatsTransactionType,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean>;
}

export class DailyAccountStatsService extends LoggerBase implements IDailyAccountStatsService {
    constructor(private readonly dataAccess: IDailyAccountStatsDataAccess) {
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
        const day = Time.formatDate(date, DateFormat.YYYY_MM_DD);
        return this.dataAccess.updateTotal(userId, day, accountId, type, amount, trx);
    }
}
