import { ITransaction } from 'interfaces/ITransaction';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { IPatchTransaction } from './IPatchTransaction';

export interface ITransactionService {
    createTransaction(transactions: ICreateTransaction): Promise<number | null>;
    getTransactions(userId: number): Promise<ITransaction[] | undefined>;
    getTransaction(userId: number, transactionId: number): Promise<ITransaction | undefined>;
    deleteTransaction(userId: number, transactionId: number): Promise<boolean>;
    patchTransaction(userId: number, transaction: IPatchTransaction): Promise<number|null>;
}
