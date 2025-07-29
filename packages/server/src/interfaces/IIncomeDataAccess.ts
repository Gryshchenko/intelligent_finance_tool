import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { ICreateIncome } from 'interfaces/ICreateIncome';
import { IIncome } from 'interfaces/IIncome';

export interface IIncomeDataAccess {
    create(userId: number, incomes: ICreateIncome[], trx?: IDBTransaction): Promise<IIncome[]>;
    gets(userId: number): Promise<IIncome[] | undefined>;
    get(userId: number, categoryId: number): Promise<IIncome | undefined>;
    patch(userId: number, incomeId: number, properties: Partial<IIncome>, trx?: IDBTransaction): Promise<number>;
    delete(userId: number, incomeId: number, trx?: IDBTransaction): Promise<boolean>;
}
