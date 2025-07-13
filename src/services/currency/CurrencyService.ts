import { ICurrencyDataAccess } from 'interfaces/ICurrencyDataAccess';
import { ICurrencyService } from 'interfaces/ICurrencyService';
import { ICurrency } from 'interfaces/ICurrency';
import { LoggerBase } from 'helper/logger/LoggerBase';

export default class CurrencyService extends LoggerBase implements ICurrencyService {
    private readonly _currencyDataAccess: ICurrencyDataAccess;

    public constructor(currencyDataAccess: ICurrencyDataAccess) {
        super();
        this._currencyDataAccess = currencyDataAccess;
    }

    public async gets(): Promise<ICurrency[]> {
        return await this._currencyDataAccess.gets();
    }

    public async getByCurrencyCode(currencyCode: string): Promise<ICurrency | undefined> {
        return await this._currencyDataAccess.getByCurrencyCode(currencyCode);
    }
    public async getById(id: string): Promise<ICurrency | undefined> {
        return await this._currencyDataAccess.getById(id);
    }
    public async getByName(symbol: string): Promise<ICurrency | undefined> {
        return this._currencyDataAccess.getByName(symbol);
    }
    public async getBySymbol(symbol: string): Promise<ICurrency | undefined> {
        return this._currencyDataAccess.getBySymbol(symbol);
    }
}
