import { IDailyCategoryStatsDataAccess } from 'services/dailyCategoryStats/DailyCategoryStatsDataAccess';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { statsValidateDate } from 'src/utils/validation/StatsValidateDate';

export interface IDailyCategoryStatsService {
    updateTotal(userId: number, date: string, categoryId: number, amount: number, trx?: IDBTransaction): Promise<boolean>;
}

export class DailyCategoryStatsService extends LoggerBase implements IDailyCategoryStatsService {
    constructor(private readonly dataAccess: IDailyCategoryStatsDataAccess) {
        super();
    }

    async updateTotal(userId: number, date: string, categoryId: number, amount: number, trx?: IDBTransaction): Promise<boolean> {
        const day: string = statsValidateDate(date);
        return this.dataAccess.updateTotal(userId, day, categoryId, amount, trx);
    }
}
