import { IEmailConfirmationData } from './IEmailConfirmationData';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { EmailConfirmationStatusType } from 'tenpercent/shared';

export interface IEmailConfirmationDataAccess {
    getUserConfirmation(userId: number, email: string): Promise<IEmailConfirmationData | undefined>;
    createUserConfirmation(
        userId: number,
        email: string,
        payload: {
            confirmationCode: number;
            expiresAt: Date;
            status: EmailConfirmationStatusType;
        },
        trx?: IDBTransaction,
    ): Promise<IEmailConfirmationData>;
    deleteUserConfirmation(userId: number, email: string): Promise<boolean>;
    patchUserConfirmation(
        userId: number,
        email: string,
        confirmationId: number,
        properties: Record<string, unknown>,
        trx?: IDBTransaction,
    ): Promise<void>;
}
