import { IEmailConfirmationData } from './IEmailConfirmationData';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';

export interface IEmailConfirmationDataAccess {
    getUserConfirmation(userId: number, email: string): Promise<IEmailConfirmationData | undefined>;
    createUserConfirmation(
        payload: {
            userId: number;
            confirmationCode: number;
            email: string;
            expiresAt: Date;
        },
        trx?: IDBTransaction,
    ): Promise<IEmailConfirmationData>;
    deleteUserConfirmation(userId: number, email: string): Promise<boolean>;
}
