import { ITransaction } from 'interfaces/ITransaction';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { IPatchTransaction } from './IPatchTransaction';
import { IPagination } from 'interfaces/IPagination';

export interface ITransactionService {
    createTransaction(transactions: ICreateTransaction): Promise<number | null>;
    getTransactions({
        userId,
        limit,
        cursor,
    }: {
        userId: number;
        limit: number;
        cursor: number;
    }): Promise<IPagination<ITransaction | null>>;
    getTransaction(userId: number, transactionId: number): Promise<ITransaction | undefined>;
    deleteTransaction(userId: number, transactionId: number): Promise<boolean>;
    patchTransaction(userId: number, transaction: IPatchTransaction): Promise<number | null>;
}
