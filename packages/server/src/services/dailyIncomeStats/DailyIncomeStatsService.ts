import { IDailyIncomeStatsDataAccess } from 'services/dailyIncomeStats/DailyIncomeStatsDataAccess';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { DateFormat, Time } from 'tenpercent/shared';
import { ValidationError } from 'src/utils/errors/ValidationError';
import { statsValidateDate } from 'src/utils/validation/StatsValidateDate';

export interface IDailyIncomeStatsService {
    updateTotal(userId: number, date: string, incomeId: number, amount: number, trx?: IDBTransaction): Promise<boolean>;
}

export class DailyIncomeStatsService extends LoggerBase implements IDailyIncomeStatsService {
    constructor(private readonly dataAccess: IDailyIncomeStatsDataAccess) {
        super();
    }

    async updateTotal(userId: number, date: string, incomeId: number, amount: number, trx?: IDBTransaction): Promise<boolean> {
        const day: string = statsValidateDate(date);
        return this.dataAccess.updateTotal(userId, day, incomeId, amount, trx);
    }
}
