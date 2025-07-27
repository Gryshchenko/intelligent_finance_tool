import { IUserStatus } from 'interfaces/IUserStatus';

export interface IUser {
    userId: number;
    email: string;
    status: IUserStatus;
    createdAt: string;
    updatedAt: string;
    currency?: {
        currencyCode: string | undefined;
        currencyName: string | undefined;
        symbol: string | undefined;
    };
    profile: {
        locale: string | undefined;
        mailConfirmed: boolean | undefined;
    };
    additionalInfo: Record<string, undefined> | undefined;
}
