import { AccountStatusType } from 'types/AccountStatusType';

export interface IIncome {
    incomeId: number;
    userId: number;
    incomeName: string;
    currencyId: number;
    status: AccountStatusType;
    createdAt: Date;
    updatedAt: Date;
}
