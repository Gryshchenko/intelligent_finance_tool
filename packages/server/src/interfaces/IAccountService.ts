import { IAccount } from 'tenpercent/shared/src/interfaces/IAccount';
import { ICreateAccount } from 'interfaces/ICreateAccount';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { IAccountListItem } from 'tenpercent/shared/src/interfaces/IAccountListItem';

export interface IAccountService {
    createAccount(userId: number, account: ICreateAccount, trx?: IDBTransaction): Promise<IAccount>;
    createAccounts(userId: number, accounts: ICreateAccount[], trx?: IDBTransaction): Promise<IAccount[]>;
    getAccounts(userId: number): Promise<IAccountListItem[] | undefined>;
    getAccount(userId: number, accountId: number): Promise<IAccount | undefined>;
    deleteAccount(userId: number, accountId: number, trx?: IDBTransaction): Promise<boolean>;
    patchAccount(userId: number, accountId: number, properties: Partial<IAccount>, trx?: IDBTransaction): Promise<number>;
}
