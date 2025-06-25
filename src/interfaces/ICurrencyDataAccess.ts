import { ICurrency } from 'interfaces/ICurrency';
import { IRate } from 'interfaces/IRate';

export interface ICurrencyDataAccess {
    postRates(baseCurrency: string, targetCurrencies: Record<string, number>): Promise<boolean>;
    patchRates(baseCurrency: string, targetCurrencies: Record<string, number>): Promise<boolean>;
    getCurrencyByCurrencyCode(currencyCode: string): Promise<ICurrency | undefined>;
    getCurrencies(): Promise<ICurrency[]>;
    getRates(baseCurrency: string): Promise<IRate[] | undefined>;
    getRate(baseCurrency: string, targetCurrency: string): Promise<IRate | undefined>;
}
