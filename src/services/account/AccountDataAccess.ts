import { IAccountDataAccess } from 'interfaces/IAccountDataAccess';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { IAccount } from 'interfaces/IAccount';
import { ICreateAccount } from 'interfaces/ICreateAccount';
import { DBError } from 'src/utils/errors/DBError';
import Utils from 'src/utils/Utils';
import { BaseError } from 'src/utils/errors/BaseError';
import { NotFoundError } from 'src/utils/errors/NotFoundError';
import { isBaseError } from 'src/utils/errors/isBaseError';

export default class AccountDataAccess extends LoggerBase implements IAccountDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }
    async createAccounts(userId: number, accounts: ICreateAccount[], trx?: IDBTransaction): Promise<IAccount[]> {
        try {
            this._logger.info(`Starting account creation for userId: ${userId}`);

            const query = trx || this._db.engine();
            const data = await query('accounts').insert(
                accounts.map(({ accountName, currencyId, amount }) => ({
                    userId,
                    accountName,
                    currencyId,
                    amount: Number(amount.toFixed(2)),
                })),
                ['accountId', 'userId', 'accountName', 'currencyId', 'amount'],
            );

            this._logger.info(`Successfully created ${data.length} accounts for userId: ${userId}`);
            return data;
        } catch (e) {
            this._logger.error(`Failed to create accounts for userId: ${userId}. Error: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Account creation failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }

    async getAccounts(userId: number): Promise<IAccount[] | undefined> {
        try {
            this._logger.info(`Fetching all accounts for userId: ${userId}`);

            const data = await this.getAccountBaseQuery()
                .innerJoin('currencies', 'accounts.currencyId', 'currencies.currencyId')
                .where({ userId });

            if (!data.length) {
                throw new NotFoundError({
                    message: `No accounts found for userId: ${userId}`,
                });
            } else {
                this._logger.info(`Fetched ${data.length} accounts for userId: ${userId}`);
            }

            return data;
        } catch (e) {
            this._logger.error(`Failed to fetch accounts for userId: ${userId}. Error: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Fetching accounts failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    async getAccount(userId: number, accountId: number): Promise<IAccount | undefined> {
        try {
            this._logger.info(`Fetching account with accountId: ${accountId} for userId: ${userId}`);

            const data = await this.getAccountBaseQuery()
                .innerJoin('currencies', 'accounts.currencyId', 'currencies.currencyId')
                .where({ userId, accountId })
                .first();

            if (!data) {
                throw new NotFoundError({
                    message: `Account with accountId: ${accountId} not found for userId: ${userId}`,
                });
            } else {
                this._logger.info(`Fetched account with accountId: ${accountId} for userId: ${userId}`);
            }

            return data;
        } catch (e) {
            this._logger.error(
                `Failed to fetch account with accountId: ${accountId} for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Fetching account failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    async patchAccount(userId: number, accountId: number, properties: Partial<IAccount>, trx?: IDBTransaction): Promise<number> {
        try {
            this._logger.info(`Patch accountId: ${accountId} for userId: ${userId}`);

            const query = trx || this._db.engine();
            const data = await query('accounts')
                .update(this.sanitizePatchAccountPropeties(properties))
                .where({ userId, accountId });

            if (!data) {
                throw new NotFoundError({
                    message: `Account with accountId: ${accountId} not found for userId: ${userId}`,
                });
            } else {
                this._logger.info(`Account accountId: ${accountId} for userId: ${userId} patched successful`);
            }

            return data;
        } catch (e) {
            this._logger.error(
                `Failed to fetch account with accountId: ${accountId} for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Patch account failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    protected sanitizePatchAccountPropeties(properties: Partial<IAccount>): Partial<IAccount> {
        const allowedProperties = Object.entries({
            accountName: properties.accountName,
            amount: Utils.isNotNull(properties.amount) ? Utils.roundNumber(properties.amount as number) : null,
            currencyId: properties.currencyId,
            currencyCode: properties.currencyCode,
            currencySymbol: properties.currencySymbol,
        }).reduce(
            (acc, [key, value]) => {
                if (!Utils.isNull(value)) {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, unknown>,
        );
        if (Object.keys(allowedProperties).length === 0) {
            throw new Error('No valid properties provided for update.');
        }

        return allowedProperties;
    }

    protected getAccountBaseQuery() {
        return this._db
            .engine()('accounts')
            .select(
                'accounts.accountId',
                'accounts.userId',
                'accounts.amount',
                'accounts.accountName',
                'accounts.currencyId',
                'currencies.currencyCode',
                'currencies.currencyName',
                'currencies.symbol',
            );
    }
}
