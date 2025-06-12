import { IIncomeDataAccess } from 'interfaces/IIncomeDataAccess';
import { IIncomeService } from 'interfaces/IIncomeService';
import { IIncome } from 'interfaces/IIncome';
import { ICreateIncome } from 'interfaces/ICreateIncome';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { validateAllowedProperties } from 'src/utils/validation/validateAllowedProperties';
import { ValidationError } from 'src/utils/errors/ValidationError';
import Utils from 'src/utils/Utils';
import { LoggerBase } from 'helper/logger/LoggerBase';

export default class IncomeService extends LoggerBase implements IIncomeService {
    private readonly _incomeDataAccess: IIncomeDataAccess;

    public constructor(incomeDataAccess: IIncomeDataAccess) {
        super();
        this._incomeDataAccess = incomeDataAccess;
    }
    async create(userId: number, income: ICreateIncome, trx?: IDBTransaction): Promise<IIncome> {
        validateAllowedProperties(income as unknown as Record<string, string | number>, ['incomeName', 'amount', 'currencyId']);
        const incomes = await this._incomeDataAccess.create(userId, [income], trx);
        return incomes[0];
    }
    async creates(userId: number, incomes: ICreateIncome[], trx?: IDBTransaction): Promise<IIncome[]> {
        return await this._incomeDataAccess.create(userId, incomes, trx);
    }
    async patch(userId: number, incomeId: number, properties: Partial<IIncome>, trx?: IDBTransaction): Promise<number> {
        return await this._incomeDataAccess.patch(userId, incomeId, properties, trx);
    }
    async get(userId: number, incomeId: number): Promise<IIncome | undefined> {
        try {
            if (Utils.isNull(incomeId)) {
                throw new ValidationError({ message: 'incomeId cant be null' });
            }
            if (Utils.isNull(userId)) {
                throw new ValidationError({ message: 'userId cant be null' });
            }
            const income = await this._incomeDataAccess.get(userId, incomeId);
            return income;
        } catch (e: unknown) {
            this._logger.error(`Fetch income failed due reason: ${(e as { message: string }).message}`);
            throw e;
        }
    }
    async gets(userId: number): Promise<IIncome[] | undefined> {
        return await this._incomeDataAccess.gets(userId);
    }
    async delete(userId: number, incomeId: number, trx?: IDBTransaction): Promise<boolean> {
        return await this._incomeDataAccess.delete(userId, incomeId, trx);
    }
}
