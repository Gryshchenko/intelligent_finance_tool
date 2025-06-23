import { IBalanceDataAccess } from 'interfaces/IBalanceDataAccess';
import { IBalanceService } from 'interfaces/IBalanceService';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { IBalance } from 'interfaces/IBalance';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';

export default class BalanceService extends LoggerBase implements IBalanceService {
    private readonly _balanceDataAccess: IBalanceDataAccess;

    public constructor(balanceDataAccess: IBalanceDataAccess) {
        super();
        this._balanceDataAccess = balanceDataAccess;
    }
    async get(userId: number): Promise<IBalance> {
        return await this._balanceDataAccess.get(userId);
    }
    async patch(userId: number, properties: Partial<IBalance>, trx?: IDBTransaction): Promise<number> {
        return await this._balanceDataAccess.patch(userId, properties, trx);
    }
}
