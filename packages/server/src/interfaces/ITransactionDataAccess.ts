import { ITransaction } from 'tenpercent/shared/src/interfaces/ITransaction';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { IDBTransaction } from './IDatabaseConnection';
import { IPagination } from 'interfaces/IPagination';
import { ITransactionListItem } from 'tenpercent/shared/src/interfaces/ITransactionListItem';
import { ITransactionListItemsRequest } from 'tenpercent/shared/src/interfaces/ITransactionListItemsRequest';

export interface ITransactionDataAccess {
    createTransaction(transaction: ICreateTransaction, trx?: IDBTransaction): Promise<number>;
    getTransactions(data: ITransactionListItemsRequest): Promise<IPagination<ITransactionListItem | null>>;
    getTransaction(userId: number, transactionId: number, trx?: IDBTransaction): Promise<ITransaction | undefined>;
    patchTransaction(userId: number, properties: Partial<ITransaction>, trx?: IDBTransaction): Promise<number>;
    deleteTransaction(userId: number, transactionId: number, trx?: IDBTransaction): Promise<boolean>;
    deleteTransactionsForAccount(userId: number, accountId: number, trx?: IDBTransaction): Promise<boolean>;
}
