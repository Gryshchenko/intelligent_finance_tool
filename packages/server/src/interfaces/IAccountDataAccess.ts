import { IAccount } from 'tenpercent/shared/src/interfaces/IAccount';
import { ICreateAccount } from 'interfaces/ICreateAccount';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { AccountStatusType } from 'tenpercent/shared/src/types/AccountStatusType';
import { IAccountListItem } from 'tenpercent/shared/src/interfaces/IAccountListItem';

export interface IAccountDataAccess {
    createAccounts(userId: number, accounts: ICreateAccount[], trx?: IDBTransaction): Promise<IAccount[]>;
    getAccounts(userId: number, status?: AccountStatusType): Promise<IAccountListItem[] | undefined>;
    getAccount(userId: number, accountId: number, status?: AccountStatusType): Promise<IAccount>;
    patchAccount(userId: number, accountId: number, properties: Partial<IAccount>, trx?: IDBTransaction): Promise<number>;
    deleteAccount(userId: number, accountId: number, trx?: IDBTransaction): Promise<boolean>;
}
