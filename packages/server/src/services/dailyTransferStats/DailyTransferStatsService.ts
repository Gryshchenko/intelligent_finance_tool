import { IDailyTransferStatsDataAccess } from 'services/dailyTransferStats/DailyTransferStatsDataAccess';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { DateFormat, Time } from 'tenpercent/shared';

export interface IDailyTransferStatsService {
    updateTotal(
        userId: number,
        date: string,
        accountId: number,
        targetAccountId: number,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean>;
}

export class DailyTransferStatsService extends LoggerBase implements IDailyTransferStatsService {
    constructor(private readonly dataAccess: IDailyTransferStatsDataAccess) {
        super();
    }

    async updateTotal(
        userId: number,
        date: string,
        accountId: number,
        targetAccountId: number,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean> {
        const day = Time.formatDate(date, DateFormat.YYYY_MM_DD);
        return this.dataAccess.updateTotal(userId, day, accountId, targetAccountId, amount, trx);
    }
}
