import { ICreateCategory } from 'interfaces/ICreateCategory';
import { ICategory } from 'interfaces/ICategory';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';

export interface ICategoryService {
    create(userId: number, incomes: ICreateCategory, trx?: IDBTransaction): Promise<ICategory>;
    delete(userId: number, incomeId: number, trx?: IDBTransaction): Promise<boolean>;
    patch(userId: number, incomeId: number, properties: Partial<ICategory>, trx?: IDBTransaction): Promise<number>;
    creates(userId: number, categories: ICreateCategory[], trx?: IDBTransaction): Promise<ICategory[]>;
    gets(userId: number): Promise<ICategory[] | undefined>;
    get(userId: number, categoryId: number): Promise<ICategory | undefined>;
}
