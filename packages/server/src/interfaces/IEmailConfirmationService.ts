import { IEmailConfirmationData } from './IEmailConfirmationData';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';

export interface IEmailConfirmationService {
    sendConfirmationMail(userId: number, email: string): Promise<IEmailConfirmationData>;
    getUserConfirmation(userId: number, email: string): Promise<IEmailConfirmationData | undefined>;
    deleteUserConfirmation(userId: number, email: string): Promise<boolean>;
    createConfirmationMail(userId: number, email: string, trx?: IDBTransaction): Promise<IEmailConfirmationData>;
    reSendConfirmationMail(userId: number, email: string): Promise<void>;
    confirmUserMail(userId: number, email: string, confirmationCode: number, trx?: IDBTransaction): Promise<void>;
}
