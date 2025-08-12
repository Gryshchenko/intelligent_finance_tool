import { AccountStatusType } from 'tenpercent/shared/src/types/AccountStatusType';

export interface IIncome {
    incomeId: number;
    userId: number;
    incomeName: string;
    currencyId: number;
    status: AccountStatusType;
    createAt: Date;
    updateAt: Date;
}
