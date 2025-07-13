import { ICurrency } from 'interfaces/ICurrency';

export interface ICurrencyService {
    getByName(symbol: string): Promise<ICurrency | undefined>;
    getBySymbol(symbol: string): Promise<ICurrency | undefined>;
    getById(id: string): Promise<ICurrency | undefined>;
    getByCurrencyCode(currencyCode: string): Promise<ICurrency | undefined>;
    gets(): Promise<ICurrency[]>;
}
