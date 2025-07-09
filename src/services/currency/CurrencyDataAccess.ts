import { ICurrencyDataAccess } from 'interfaces/ICurrencyDataAccess';
import { IDatabaseConnection } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { ICurrency } from 'interfaces/ICurrency';
import { DBError } from 'src/utils/errors/DBError';
import { BaseError } from 'src/utils/errors/BaseError';
import { NotFoundError } from 'src/utils/errors/NotFoundError';
import { isBaseError } from 'src/utils/errors/isBaseError';
import { IRate } from 'interfaces/IRate';

export default class CurrencyDataAccess extends LoggerBase implements ICurrencyDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }
    public async postRates(baseCurrency: string, targetCurrencies: Record<string, number>): Promise<boolean> {
        try {
            this._logger.info(
                `Inserting list of currencies rates for currency: ${baseCurrency}, rates: ${Object.keys(targetCurrencies).length}`,
            );
            const records = Object.entries(targetCurrencies).map(([targetCurrency, rate]) => ({
                baseCurrency,
                targetCurrency,
                rate,
            }));

            if (records.length === 0) {
                throw new Error('target currencies empty');
            }

            const response = await this._db.engine()('currencyRates').insert(records);
            return response.length === records.length;
        } catch (e) {
            this._logger.info(
                `Insert list of currencies rates for currency: ${baseCurrency} failed due reason: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Insert list of currencies rates for currency: ${baseCurrency} failed due reason: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    public async patchRates(baseCurrency: string, targetCurrencies: Record<string, number>): Promise<boolean> {
        try {
            this._logger.info(
                `Patch list of currencies rates for currency: ${baseCurrency}, rates: ${Object.keys(targetCurrencies).length}`,
            );
            const keys = Object.keys(targetCurrencies);
            if (keys.length === 0) {
                throw new Error('target currencies empty');
            }
            const cases = keys.map(() => 'WHEN ? THEN ?').join(' ');

            const inPlaceholders = keys.map(() => '?').join(', ');

            const bindings: string[] = [];

            for (const key of keys) {
                bindings.push(key, String(targetCurrencies[key]));
            }

            bindings.push(baseCurrency, ...keys);

            const query = `
                    UPDATE currencyRates 
                    SET rate = CASE targetCurrency
                      ${cases}
                    END
                    WHERE baseCurrency = ? AND targetCurrency IN (${inPlaceholders})
              `;

            await this._db.engine().raw(query, bindings);
            return true;
        } catch (e) {
            this._logger.info(
                `Updating list of currencies rates for currency: ${baseCurrency} failed due reason: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Updating list of currencies rates for currency: ${baseCurrency} failed due reason: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }
    public async getRate(baseCurrency: string, targetCurrency: string): Promise<IRate | undefined> {
        try {
            this._logger.info(`Fetch rate for baseCurrency: ${baseCurrency}, targetCurrency: ${targetCurrency}`);
            const data = await this._db
                .engine()('currencyRates')
                .select<IRate>('baseCurrency', 'targetCurrency', 'rate', 'updateAt')
                .where({
                    baseCurrency,
                    targetCurrency,
                })
                .first();
            if (data) {
                this._logger.info(`Rate for code ${baseCurrency} fetched successfully - ${JSON.stringify(data)}`);
                return data;
            } else {
                throw new NotFoundError({
                    message: `Currency with code ${baseCurrency} - ${targetCurrency} not found`,
                });
            }
        } catch (e) {
            this._logger.error(`Fetch failed due reason: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Fetch failed due reason: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }
    public async getRates(baseCurrency: string): Promise<IRate[] | undefined> {
        try {
            this._logger.info(`Fetch rates for baseCurrency: ${baseCurrency}`);
            const data = await this._db
                .engine()('currencyRates')
                .select<IRate[]>('baseCurrency', 'targetCurrency', 'rate', 'updateAt')
                .where({
                    baseCurrency,
                });
            if (data) {
                this._logger.info(`Rate for code ${baseCurrency} fetched successfully: ${data.length}`);
                return data;
            } else {
                throw new NotFoundError({
                    message: `Rates with code ${baseCurrency}  not found`,
                });
            }
        } catch (e) {
            this._logger.error(`Fetch failed due reason: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Fetch failed due reason: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    public async getCurrencies(): Promise<ICurrency[]> {
        this._logger.info('Fetching list of currencies');

        try {
            const data = await this._db.engine()<ICurrency>('currencies').select<ICurrency[]>(['*']);
            this._logger.info(`Successfully fetched list ${data.length} of currencies`);
            return data;
        } catch (e) {
            this._logger.error(`Error fetching currencies: ${(e as { message: string }).message}`);
            throw new DBError({ message: `Error fetching currencies: ${(e as { message: string }).message}` });
        }
    }

    public async getCurrencyByCurrencyCode(currencyCode: string): Promise<ICurrency | undefined> {
        this._logger.info(`Fetching currency with code: ${currencyCode}`);

        try {
            const data = await this._db
                .engine()<ICurrency>('currencies')
                .where({ currencyCode })
                .select<ICurrency>(['currencyId', 'currencyCode', 'currencyName'])
                .first();

            if (data) {
                this._logger.info(`Currency with code ${currencyCode} fetched successfully`);
                return data;
            } else {
                throw new NotFoundError({
                    message: `Currency with code ${currencyCode} not found`,
                });
            }
        } catch (e) {
            this._logger.error(`Error fetching currency with code ${currencyCode}: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Error fetching currency with code ${currencyCode}: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }
}
