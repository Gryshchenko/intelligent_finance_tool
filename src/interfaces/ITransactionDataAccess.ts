import { ITransaction } from 'interfaces/ITransaction';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { IDBTransaction } from './IDatabaseConnection';

export interface ITransactionDataAccess {
    createTransaction(transaction: ICreateTransaction, trx?: IDBTransaction): Promise<number>;
    getTransactions(userId: number): Promise<ITransaction[] | undefined>;
    getTransaction(userId: number, transactionId: number): Promise<ITransaction | undefined>;
    patchTransaction(userId: number, transactionId: number, properties: Partial<ITransaction>, trx?: IDBTransaction): Promise<number>;
    deleteTransaction(userId: number, transactionId: number, trx?: IDBTransaction): Promise<boolean>;
}
