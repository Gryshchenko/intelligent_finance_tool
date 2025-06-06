import { AccountStatusType } from 'types/AccountStatusType';

export interface IAccount {
    accountId: number;
    userId: number;
    accountName: string;
    amount: number;
    currencyId: number;
    currencyCode: string;
    currencySymbol: string;
    status: AccountStatusType;
}
