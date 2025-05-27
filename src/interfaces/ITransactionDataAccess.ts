import { ITransaction } from 'interfaces/ITransaction';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { IDBTransaction } from './IDatabaseConnection';
import { IPagination } from 'interfaces/IPagination';

export interface ITransactionDataAccess {
    createTransaction(transaction: ICreateTransaction, trx?: IDBTransaction): Promise<number>;
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
    patchTransaction(userId: number, properties: Partial<ITransaction>, trx?: IDBTransaction): Promise<number>;
    deleteTransaction(userId: number, transactionId: number, trx?: IDBTransaction): Promise<boolean>;
    deleteTransactionsForAccount(userId: number, accountId: number, trx?: IDBTransaction): Promise<boolean>;
}
