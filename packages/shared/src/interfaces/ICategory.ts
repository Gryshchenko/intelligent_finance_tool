import { AccountStatusType } from 'tenpercent/shared/src/types/AccountStatusType';

export interface ICategory {
    categoryName: string;
    categoryId: number;
    userId: number;
    currencyId: number;
    status: AccountStatusType;
    createAt: Date;
    updateAt: Date;
}
