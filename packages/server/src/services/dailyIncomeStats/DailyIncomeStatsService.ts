import { IDailyIncomeStatsDataAccess } from 'services/dailyIncomeStats/DailyIncomeStatsDataAccess';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { DateFormat, Time } from 'tenpercent/shared';

export interface IDailyIncomeStatsService {
    updateTotal(userId: number, date: string, incomeId: number, amount: number, trx?: IDBTransaction): Promise<boolean>;
}

export class DailyIncomeStatsService extends LoggerBase implements IDailyIncomeStatsService {
    constructor(private readonly dataAccess: IDailyIncomeStatsDataAccess) {
        super();
    }

    async updateTotal(userId: number, date: string, incomeId: number, amount: number, trx?: IDBTransaction): Promise<boolean> {
        const day = Time.formatDate(date, DateFormat.YYYY_MM_DD);
        return this.dataAccess.updateTotal(userId, day, incomeId, amount, trx);
    }
}
