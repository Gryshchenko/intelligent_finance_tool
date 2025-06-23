import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { IBalance } from 'interfaces/IBalance';

export interface IBalanceDataAccess {
    get(userId: number): Promise<IBalance>;
    patch(userId: number, properties: Partial<IBalance>, trx?: IDBTransaction): Promise<number>;
}
