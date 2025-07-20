import { ICurrencyDataAccess } from 'interfaces/ICurrencyDataAccess';
import { IDatabaseConnection } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { ICurrency } from 'interfaces/ICurrency';
import { DBError } from 'src/utils/errors/DBError';
import { BaseError } from 'src/utils/errors/BaseError';
import { NotFoundError } from 'src/utils/errors/NotFoundError';
import { isBaseError } from 'src/utils/errors/isBaseError';
import { ValidationError } from 'src/utils/errors/ValidationError';

export default class CurrencyDataAccess extends LoggerBase implements ICurrencyDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }

    public async gets(): Promise<ICurrency[]> {
        this._logger.info('Fetching list of currencies');

        try {
            const data = await this._db
                .engine()<ICurrency>('currencies')
                .select<ICurrency[]>(['currencyId', 'symbol', 'currencyCode', 'currencyName']);
            this._logger.info(`Successfully fetched list ${data.length} of currencies`);
            return data;
        } catch (e) {
            this._logger.error(`Error fetching currencies: ${(e as { message: string }).message}`);
            throw new DBError({ message: `Error fetching currencies: ${(e as { message: string }).message}` });
        }
    }
    protected async genericGet(
        obj: Partial<{
            currencyId: number;
            symbol: string;
            currencyCode: string;
            currencyName: string;
        }>,
    ): Promise<ICurrency> {
        const keys = Object.keys(obj);
        if (keys.length !== 1) {
            throw new ValidationError({
                message: 'Exactly one search key is required',
            });
        }
        const key = keys[0];

        try {
            this._logger.info(`Fetching currency by property: ${key}`);
            const whiteList = ['currencyId', 'currencyCode', 'currencyName', 'symbol'];
            if (!whiteList.includes(key)) {
                throw new ValidationError({
                    message: `Key not pass white list check : ${JSON.stringify(obj)}`,
                });
            }
            const data = await this._db
                .engine()<ICurrency>('currencies')
                .where(obj)
                .select<ICurrency>(['currencyId', 'currencyCode', 'currencyName', 'symbol'])
                .first();

            if (data) {
                this._logger.info(`Currency  by property ${key} fetched successfully`);
                return data;
            } else {
                throw new NotFoundError({
                    message: `Currency  by property ${key} not found`,
                });
            }
        } catch (e) {
            this._logger.error(`Error fetching currency by property ${key}: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Error fetching currency by property ${key}: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    public async getByCurrencyCode(currencyCode: string): Promise<ICurrency | undefined> {
        return await this.genericGet({ currencyCode: currencyCode });
    }
    public async getById(id: number): Promise<ICurrency | undefined> {
        return await this.genericGet({ currencyId: id });
    }
    public async getBySymbol(symbol: string): Promise<ICurrency | undefined> {
        return await this.genericGet({ symbol: symbol });
    }
    public async getByName(currencyName: string): Promise<ICurrency | undefined> {
        return await this.genericGet({ currencyName: currencyName });
    }
}
