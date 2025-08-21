import { IEmailConfirmationData } from './IEmailConfirmationData';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';

export interface IEmailConfirmationService {
    createEmailConfirmation(userId: number, email: string, trx?: IDBTransaction): Promise<IEmailConfirmationData>;
    sendConfirmationEmail(userId: number, email: string, properties: IEmailConfirmationData): Promise<IEmailConfirmationData>;
    resendConfirmationEmail(userId: number, email: string): Promise<void>;
    confirmEmail(userId: number, email: string, confirmationCode: number, trx?: IDBTransaction): Promise<void>;
    getEmailConfirmation(userId: number, email: string): Promise<IEmailConfirmationData | undefined>;
    deleteEmailConfirmation(userId: number, email: string): Promise<boolean>;
    // requestEmailChange(userId: number, newEmail: string, trx?: IDBTransaction): Promise<void>;
    // confirmEmailChange(userId: number, newEmail: string, confirmationCode: number, trx?: IDBTransaction): Promise<void>;
}
