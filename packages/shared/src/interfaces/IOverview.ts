import { ICategory } from 'interfaces/ICategory';
import { IIncome } from 'interfaces/IIncome';
import { IAccountListItem } from 'interfaces/IAccountListItem';

export interface IOverview {
    accounts: IAccountListItem[] | [];
    categories: ICategory[] | [];
    incomes: IIncome[] | [];
}
