import { IIncomeDataAccess } from 'interfaces/IIncomeDataAccess';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { IIncome } from 'tenpercent/shared/src/interfaces/IIncome';
import { ICreateIncome } from 'interfaces/ICreateIncome';
import { DBError } from 'src/utils/errors/DBError';
import { BaseError } from 'src/utils/errors/BaseError';
import { NotFoundError } from 'src/utils/errors/NotFoundError';
import { isBaseError } from 'src/utils/errors/isBaseError';
import { validateAllowedProperties } from 'src/utils/validation/validateAllowedProperties';
import { AccountStatusType } from 'tenpercent/shared/src/types/AccountStatusType';

export default class IncomeDataAccess extends LoggerBase implements IIncomeDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }

    public async create(userId: number, incomes: ICreateIncome[], trx?: IDBTransaction): Promise<IIncome[]> {
        this._logger.info(`Starting creation of incomes for userId ${userId}`);

        try {
            const query = trx || this._db.engine();
            const data = await query('incomes').insert(
                incomes.map(({ incomeName, currencyId }) => ({
                    userId,
                    incomeName,
                    currencyId,
                    status: AccountStatusType.Enable,
                })),
                ['incomeId', 'userId', 'incomeName', 'currencyId'],
            );

            this._logger.info(`Successfully created incomes for userId ${userId}`);
            return data;
        } catch (e) {
            this._logger.error(`Error creating incomes for userId ${userId}: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Fetching incomes failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }

    public async gets(userId: number): Promise<IIncome[] | undefined> {
        this._logger.info(`Fetching incomes for userId ${userId}`);

        try {
            const data = await this.getIncomeBaseQuery()
                .innerJoin('currencies', 'incomes.currencyId', 'currencies.currencyId')
                .where({ userId, status: AccountStatusType.Enable });

            this._logger.info(`Successfully fetched incomes for userId ${userId}`);
            return data;
        } catch (e) {
            this._logger.error(`Error fetching incomes for userId ${userId}: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Fetching incomes failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }

    public async get(userId: number, incomeId: number): Promise<IIncome | undefined> {
        this._logger.info(`Fetching income with ID ${incomeId} for userId ${userId}`);

        try {
            const data = await this.getIncomeBaseQuery()
                .innerJoin('currencies', 'incomes.currencyId', 'currencies.currencyId')
                .where({ userId, incomeId, status: AccountStatusType.Enable })
                .first();

            if (data) {
                this._logger.info(`Successfully fetched income with ID ${incomeId} for userId ${userId}`);
            } else {
                throw new NotFoundError({
                    message: `No income found with ID ${incomeId} for userId ${userId}`,
                });
            }

            return data;
        } catch (e) {
            this._logger.error(
                `Error fetching income with ID ${incomeId} for userId ${userId}: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Fetching income failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    protected getIncomeBaseQuery() {
        return this._db
            .engine()('incomes')
            .select(
                'incomes.incomeId',
                'incomes.userId',
                'incomes.incomeName',
                'incomes.currencyId',
                'currencies.currencyCode',
                'currencies.currencyName',
                'currencies.symbol',
            );
    }
    async patch(userId: number, incomeId: number, properties: Partial<IIncome>, trx?: IDBTransaction): Promise<number> {
        try {
            this._logger.info(`Patch incomeId: ${incomeId} for userId: ${userId}`);
            const allowedProperties = {
                incomeName: properties.incomeName,
                updateAt: new Date().toISOString(),
                status: properties.status,
            };
            validateAllowedProperties(allowedProperties, ['incomeName', 'updateAt', 'status']);
            const query = trx || this._db.engine();
            const data = await query('incomes').update(properties).where({ userId, incomeId });

            if (!data) {
                throw new NotFoundError({
                    message: `Income with incomeId: ${incomeId} not found for userId: ${userId}`,
                });
            } else {
                this._logger.info(`Income incomeId: ${incomeId} for userId: ${userId} patched successful`);
            }

            return data;
        } catch (e) {
            this._logger.error(
                `Failed to fetch income with incomeId: ${incomeId} for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Patch income failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }
    async delete(userId: number, incomeId: number, trx?: IDBTransaction): Promise<boolean> {
        try {
            this._logger.info(`Delete incomeID: ${incomeId} for userId: ${userId}`);

            const query = trx || this._db.engine();
            const data = await query('incomes').delete().where({ userId, incomeId });
            if (!data) {
                throw new NotFoundError({
                    message: `Income with incomeId: ${incomeId} not found for userId: ${userId}`,
                });
            }
            this._logger.info(`Income incomeId: ${incomeId} for userId: ${userId} delete successful`);
            return true;
        } catch (e) {
            this._logger.error(
                `Failed income deleting with incomeId: ${incomeId} for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Delete income failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }
}
