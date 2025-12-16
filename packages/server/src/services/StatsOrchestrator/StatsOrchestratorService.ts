import { LoggerBase } from 'helper/logger/LoggerBase';
import { IDailyCategoryStatsService } from 'services/dailyCategoryStats/DailyCategoryStatsService';
import { IDailyIncomeStatsService } from 'services/dailyIncomeStats/DailyIncomeStatsService';
import { IDailyAccountStatsService } from 'services/dailyAccountStats/DailyAccountStatsService';
import { IDailyTransferStatsService } from 'services/dailyTransferStats/DailyTransferStatsService';
import { IDailyStatsService } from 'services/dailyStats/DailyStatsService';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { StatsTransactionType } from 'types/StatsTransactionType';
import { DBError } from 'src/utils/errors/DBError';

export interface IStatsOrchestratorService {
    handleExpanse(
        userId: number,
        date: string,
        accountId: number,
        categoryId: number,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean>;
    handleIncomes(
        userId: number,
        date: string,
        incomeId: number,
        accountId: number,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean>;
    handleTransfer(
        userId: number,
        date: string,
        accountId: number,
        targetAccountId: number,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean>;
}

export default class StatsOrchestratorService extends LoggerBase implements IStatsOrchestratorService {
    private readonly _dailyCategoryStatsService: IDailyCategoryStatsService;
    private readonly _dailyIncomeStatsService: IDailyIncomeStatsService;
    private readonly _dailyAccountStatsService: IDailyAccountStatsService;
    private readonly _dailyTransferStatsService: IDailyTransferStatsService;
    private readonly _dailyStatsService: IDailyStatsService;

    public constructor({
        dailyCategoryStatsService,
        dailyIncomeStatsService,
        dailyAccountStatsService,
        dailyTransferStatsService,
        dailyStatsService,
    }: {
        dailyCategoryStatsService: IDailyCategoryStatsService;
        dailyIncomeStatsService: IDailyIncomeStatsService;
        dailyAccountStatsService: IDailyAccountStatsService;
        dailyTransferStatsService: IDailyTransferStatsService;
        dailyStatsService: IDailyStatsService;
    }) {
        super();
        this._dailyAccountStatsService = dailyAccountStatsService;
        this._dailyCategoryStatsService = dailyCategoryStatsService;
        this._dailyIncomeStatsService = dailyIncomeStatsService;
        this._dailyTransferStatsService = dailyTransferStatsService;
        this._dailyStatsService = dailyStatsService;
    }

    public async handleExpanse(
        userId: number,
        date: string,
        accountId: number,
        categoryId: number,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean> {
        const response = await Promise.all([
            await this._dailyStatsService.updateTotal(userId, date, StatsTransactionType.EXPENSE, amount, trx),
            await this._dailyCategoryStatsService.updateTotal(userId, date, categoryId, amount, trx),
            await this._dailyAccountStatsService.updateTotal(userId, date, accountId, StatsTransactionType.EXPENSE, amount, trx),
        ]);
        const allSucceeded = response.every((r) => r === true);

        if (!allSucceeded) {
            throw new DBError({ message: 'Not all expanse stats updates succeeded' });
        }
        return true;
    }
    public async handleIncomes(
        userId: number,
        date: string,
        incomeId: number,
        accountId: number,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean> {
        const response = await Promise.all([
            await this._dailyStatsService.updateTotal(userId, date, StatsTransactionType.INCOME, amount, trx),
            await this._dailyAccountStatsService.updateTotal(userId, date, accountId, StatsTransactionType.INCOME, amount, trx),
            await this._dailyIncomeStatsService.updateTotal(userId, date, incomeId, amount, trx),
        ]);
        const allSucceeded = response.every((r) => r === true);

        if (!allSucceeded) {
            throw new DBError({ message: 'Not all incomes stats updates succeeded' });
        }
        return true;
    }
    public async handleTransfer(
        userId: number,
        date: string,
        accountId: number,
        targetAccountId: number,
        amount: number,
        trx?: IDBTransaction,
    ): Promise<boolean> {
        const response = await Promise.all([
            await this._dailyStatsService.updateTotal(userId, date, StatsTransactionType.TRANSFER, amount, trx),
            await this._dailyAccountStatsService.updateTotal(userId, date, accountId, StatsTransactionType.EXPENSE, amount, trx),
            await this._dailyAccountStatsService.updateTotal(
                userId,
                date,
                targetAccountId,
                StatsTransactionType.INCOME,
                amount,
                trx,
            ),
            await this._dailyTransferStatsService.updateTotal(userId, date, accountId, targetAccountId, amount, trx),
        ]);
        const allSucceeded = response.every((r) => r === true);

        if (!allSucceeded) {
            throw new DBError({ message: 'Not all transfer stats updates succeeded' });
        }
        return true;
    }
}
