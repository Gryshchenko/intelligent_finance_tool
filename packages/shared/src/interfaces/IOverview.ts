import { ICategory } from 'interfaces/ICategory';
import { IAccount } from 'interfaces/IAccount';
import { IIncome } from 'interfaces/IIncome';

export interface IOverview {
    accounts: IAccount[] | [];
    categories: ICategory[] | [];
    incomes: IIncome[] | [];
}
