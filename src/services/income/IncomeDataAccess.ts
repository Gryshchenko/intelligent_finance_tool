import { IIncomeDataAccess } from 'interfaces/IIncomeDataAccess';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { IIncome } from 'interfaces/IIncome';
import { ICreateIncome } from 'interfaces/ICreateIncome';
import { DBError } from 'src/utils/errors/DBError';
import { BaseError } from 'src/utils/errors/BaseError';
import { NotFoundError } from 'src/utils/errors/NotFoundError';
import { isBaseError } from 'src/utils/errors/isBaseError';

export default class IncomeDataAccess extends LoggerBase implements IIncomeDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }

    public async createIncomes(userId: number, incomes: ICreateIncome[], trx?: IDBTransaction): Promise<IIncome[]> {
        this._logger.info(`Starting creation of incomes for userId ${userId}`);

        try {
            const query = trx || this._db.engine();
            const data = await query('incomes').insert(
                incomes.map(({ incomeName, currencyId }) => ({ userId, incomeName, currencyId })),
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

    public async getIncomes(userId: number): Promise<IIncome[] | undefined> {
        this._logger.info(`Fetching incomes for userId ${userId}`);

        try {
            const data = await this.getIncomeBaseQuery()
                .innerJoin('currencies', 'incomes.currencyId', 'currencies.currencyId')
                .where({ userId });

            this._logger.info(`Successfully fetched incomes for userId ${userId}`);
            return data;
        } catch (e) {
            this._logger.error(`Error fetching incomes for userId ${userId}: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Fetching incomes failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }

    public async getIncome(userId: number, incomeId: number): Promise<IIncome | undefined> {
        this._logger.info(`Fetching income with ID ${incomeId} for userId ${userId}`);

        try {
            const data = await this.getIncomeBaseQuery().where({ userId, incomeId }).first();

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
        return this._db.engine()('incomes').select(
            'incomes.incomeId',
            'incomes.userId',
            // 'incomes.amount',
            'incomes.incomeName',
            'incomes.currencyId',
            'currencies.currencyCode',
            'currencies.currencyName',
            'currencies.symbol',
        );
    }
}
