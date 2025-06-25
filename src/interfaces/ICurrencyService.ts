import { ICurrency } from 'interfaces/ICurrency';
import { IRate } from 'interfaces/IRate';

export interface ICurrencyService {
    getCurrencyByCurrencyCode(currencyCode: string): Promise<ICurrency | undefined>;
    getCurrencies(): Promise<ICurrency[]>;
    updateCurrencyRates(): Promise<void>;
    getRate(baseCurrency: string, targetCurrency: string): Promise<IRate | undefined>;
}
