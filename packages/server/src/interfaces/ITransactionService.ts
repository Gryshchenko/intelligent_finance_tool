import { ITransaction } from 'tenpercent/shared/src/interfaces/ITransaction';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { IPatchTransaction } from './IPatchTransaction';
import { IPagination } from 'tenpercent/shared/src/interfaces/IPagination';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { ITransactionListItem } from 'tenpercent/shared/src/interfaces/ITransactionListItem';
import { ITransactionListItemsRequest } from 'tenpercent/shared/src/interfaces/ITransactionListItemsRequest';

export interface ITransactionService {
    createTransaction(transactions: ICreateTransaction): Promise<number | null>;
    getTransactions({ userId, limit, cursor }: ITransactionListItemsRequest): Promise<IPagination<ITransactionListItem | null>>;
    getTransaction(userId: number, transactionId: number): Promise<ITransaction | undefined>;
    deleteTransaction(userId: number, transactionId: number): Promise<boolean>;
    patchTransaction(userId: number, transaction: IPatchTransaction): Promise<number | null>;
    deleteTransactionsForAccount(userId: number, accountId: number, trx?: IDBTransaction): Promise<boolean>;
}
