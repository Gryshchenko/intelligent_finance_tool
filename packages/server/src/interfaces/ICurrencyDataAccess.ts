import { ICurrency } from 'tenpercent/shared';

export interface ICurrencyDataAccess {
    getByName(symbol: string): Promise<ICurrency | undefined>;
    getBySymbol(symbol: string): Promise<ICurrency | undefined>;
    getById(id: number): Promise<ICurrency | undefined>;
    getByCurrencyCode(currencyCode: string): Promise<ICurrency | undefined>;
    gets(): Promise<ICurrency[]>;
}
