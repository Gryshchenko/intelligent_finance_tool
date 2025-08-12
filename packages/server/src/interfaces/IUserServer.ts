import { IUserStatus } from 'tenpercent/shared/src/interfaces/IUserStatus';

export interface IUserServer {
    email: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    status: IUserStatus;
    locale: string;
    publicName: string | undefined;
    additionalInfo: Record<string, undefined> | undefined;
    currencyCode: string;
    currencyName: string;
    symbol: string;
    mailConfirmed: boolean;
}
