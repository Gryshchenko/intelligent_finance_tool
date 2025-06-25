import { ICurrencyDataAccess } from 'interfaces/ICurrencyDataAccess';
import { ICurrencyService } from 'interfaces/ICurrencyService';
import { ICurrency } from 'interfaces/ICurrency';
import { IRateProvider } from 'interfaces/IRateProvider';
import RateProviderBuilder from 'services/currency/providers/RateProviderBuilder';
import { IRate } from 'interfaces/IRate';
import { Time, TimeDuration } from 'src/utils/time/Time';
import { LoggerBase } from 'helper/logger/LoggerBase';

export default class CurrencyService extends LoggerBase implements ICurrencyService {
    private readonly _currencyDataAccess: ICurrencyDataAccess;
    private readonly _rateProvider: IRateProvider;

    public constructor(currencyDataAccess: ICurrencyDataAccess) {
        super();
        this._currencyDataAccess = currencyDataAccess;
        this._rateProvider = RateProviderBuilder.build();
    }
    private async logAndStoreRates(
        action: 'insert' | 'update',
        currencyCode: string,
        rates: Record<string, number>,
        storeFn: (currencyCode: string, rates: Record<string, number>) => Promise<boolean>,
    ): Promise<void> {
        const result = await storeFn(currencyCode, rates);
        const actionStr = action === 'insert' ? 'inserted' : 'updated';
        const failStr = action === 'insert' ? 'insert' : 'update';

        if (!result) {
            this._logger.error(`Failed to ${failStr} rates for ${currencyCode}, count: ${Object.keys(rates).length}`);
        } else {
            this._logger.info(`Rates for ${currencyCode} successfully ${actionStr}, count: ${Object.keys(rates).length}`);
        }
    }

    public async updateCurrencyRates(): Promise<void> {
        try {
            this._logger.info('Start currency rates update process');

            const currencies = await this.getCurrencies();
            const currenciesCodes = currencies.map((c) => c.currencyCode);

            for (const { currencyCode } of currencies) {
                const currentRates = await this._currencyDataAccess.getRates(currencyCode);
                const currentRatesArray = Array.isArray(currentRates) ? currentRates : [];

                if (currentRatesArray.length === 0) {
                    this._logger.info(`No existing rates for ${currencyCode}, inserting new full set`);
                    const rates = await this._rateProvider.getRates(currencyCode, currenciesCodes);
                    await this.logAndStoreRates(
                        'insert',
                        currencyCode,
                        rates,
                        this._currencyDataAccess.postRates.bind(this._currencyDataAccess),
                    );
                } else {
                    const outdatedTargets = currentRatesArray
                        .filter(
                            (rate) =>
                                Time.getDiff({
                                    to: rate.updateAt,
                                    duration: TimeDuration.Hour,
                                }) >= 12,
                        )
                        .map((rate) => rate.targetCurrency);

                    if (outdatedTargets.length > 0) {
                        this._logger.info(`Found ${outdatedTargets.length} outdated rates for ${currencyCode}, updating...`);
                        const rates = await this._rateProvider.getRates(currencyCode, outdatedTargets);
                        await this.logAndStoreRates(
                            'update',
                            currencyCode,
                            rates,
                            this._currencyDataAccess.patchRates.bind(this._currencyDataAccess),
                        );
                    } else {
                        this._logger.info(`All rates for ${currencyCode} are up to date`);
                    }
                }
            }
        } catch (e) {
            this._logger.error(`Currency rate update failed: ${(e as { message: string }).message}`);
        }
    }

    public async getCurrencyByCurrencyCode(currencyCode: string): Promise<ICurrency | undefined> {
        return await this._currencyDataAccess.getCurrencyByCurrencyCode(currencyCode);
    }

    public async getCurrencies(): Promise<ICurrency[]> {
        return await this._currencyDataAccess.getCurrencies();
    }

    public async getRate(baseCurrency: string, targetCurrency: string): Promise<IRate | undefined> {
        return await this._currencyDataAccess.getRate(baseCurrency, targetCurrency);
    }
}
