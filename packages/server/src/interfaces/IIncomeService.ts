import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { ICreateIncome } from 'interfaces/ICreateIncome';
import { IIncome } from 'tenpercent/shared/src/interfaces/IIncome';

export interface IIncomeService {
    creates(userId: number, incomes: ICreateIncome[], trx?: IDBTransaction): Promise<IIncome[]>;
    create(userId: number, incomes: ICreateIncome, trx?: IDBTransaction): Promise<IIncome>;
    gets(userId: number): Promise<IIncome[] | undefined>;
    get(userId: number, accountId: number): Promise<IIncome | undefined>;
    delete(userId: number, incomeId: number, trx?: IDBTransaction): Promise<boolean>;
    patch(userId: number, incomeId: number, properties: Partial<IIncome>, trx?: IDBTransaction): Promise<number>;
}
