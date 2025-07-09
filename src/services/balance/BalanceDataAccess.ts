import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { IBalanceDataAccess } from 'interfaces/IBalanceDataAccess';
import { IBalance } from 'interfaces/IBalance';
import { NotFoundError } from 'src/utils/errors/NotFoundError';
import { DBError } from 'src/utils/errors/DBError';
import { isBaseError } from 'src/utils/errors/isBaseError';
import { BaseError } from 'src/utils/errors/BaseError';
import { validateAllowedProperties } from 'src/utils/validation/validateAllowedProperties';
import Utils from 'src/utils/Utils';

export default class BalanceDataAccess extends LoggerBase implements IBalanceDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }
    async get(userId: number): Promise<IBalance> {
        try {
            this._logger.info(`Fetching balance for userId: ${userId}`);

            const data = await this._db
                .engine()('balance')
                .select('balanceId', 'balance', 'updateAt', 'createAt')
                .where({ userId })
                .first();

            if (!data) {
                throw new NotFoundError({
                    message: `Balance not found for userId: ${userId}`,
                });
            } else {
                this._logger.info(`Fetched balance for userId: ${userId}`);
            }

            return data;
        } catch (e) {
            this._logger.error(`Failed to fetch balance for userId: ${userId}. Error: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Fetching balance failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }
    async patch(userId: number, properties: { amount: number }, trx?: IDBTransaction): Promise<number> {
        try {
            this._logger.info(`Patch balance for userId: ${userId}`);
            const allowedProperties = {
                balance: properties.amount,
                updateAt: new Date().toISOString(),
            };
            validateAllowedProperties(allowedProperties, ['updateAt', 'balance']);
            const query = trx || this._db.engine();

            const data = await query.transaction(async (trx) => {
                await trx('balance')
                    .where('id', userId)
                    .update({
                        balance: trx.raw('balance + ?', [allowedProperties.balance]),
                        updatedAt: trx.fn.now(),
                    })
                    .returning('balance');
            });

            if (Utils.isNull(data)) {
                throw new NotFoundError({
                    message: `Balance not found for userId: ${userId}`,
                });
            } else {
                this._logger.info(`Balance for userId: ${userId} patched successful`);
            }

            return Number(data);
        } catch (e) {
            this._logger.error(`Failed to fetch balance for userId: ${userId}. Error: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Patch balance failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }
}
