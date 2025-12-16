import { IDailyCategoryStatsDataAccess } from 'services/dailyCategoryStats/DailyCategoryStatsDataAccess';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { DateFormat, Time } from 'tenpercent/shared/src/utils/time/Time';

export interface IDailyCategoryStatsService {
    updateTotal(userId: number, date: string, categoryId: number, amount: number, trx?: IDBTransaction): Promise<boolean>;
}

export class DailyCategoryStatsService extends LoggerBase implements IDailyCategoryStatsService {
    constructor(private readonly dataAccess: IDailyCategoryStatsDataAccess) {
        super();
    }

    async updateTotal(userId: number, date: string, categoryId: number, amount: number, trx?: IDBTransaction): Promise<boolean> {
        const day = Time.formatDate(date, DateFormat.YYYY_MM_DD);
        return this.dataAccess.updateTotal(userId, day, categoryId, amount, trx);
    }
}
