import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { IBalance } from 'interfaces/IBalance';

export interface IBalanceService {
    get(userId: number): Promise<IBalance>;
    patch(userId: number, properties: { amount: number; currencyCode: string }, trx?: IDBTransaction): Promise<number>;
}
