import { IAccountDataAccess } from 'interfaces/IAccountDataAccess';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { IAccount } from 'tenpercent/shared/src/interfaces/IAccount';
import { ICreateAccount } from 'interfaces/ICreateAccount';
import { DBError } from 'src/utils/errors/DBError';
import Utils from 'src/utils/Utils';
import { BaseError } from 'src/utils/errors/BaseError';
import { NotFoundError } from 'src/utils/errors/NotFoundError';
import { isBaseError } from 'src/utils/errors/isBaseError';
import { validateAllowedProperties } from 'src/utils/validation/validateAllowedProperties';
import { AccountStatusType } from 'tenpercent/shared/src/types/AccountStatusType';
import { getOnlyNotEmptyProperties } from 'src/utils/validation/getOnlyNotEmptyProperties';

export default class AccountDataAccess extends LoggerBase implements IAccountDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }
    async createAccounts(userId: number, accounts: ICreateAccount[], trx?: IDBTransaction): Promise<IAccount[]> {
        try {
            this._logger.info(`Starting account creation for userId: ${userId}`);
            for (const account of accounts) {
                validateAllowedProperties(account as unknown as Record<string, string | number>, [
                    'accountName',
                    'amount',
                    'currencyId',
                ]);
            }
            const query = trx || this._db.engine();
            const data = await query('accounts').insert(
                accounts.map(({ accountName, currencyId, amount }) => ({
                    userId,
                    accountName,
                    currencyId,
                    status: AccountStatusType.Enable,
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
                .where({ userId, status: AccountStatusType.Enable });

            if (!data.length) {
                this._logger.info(`No accounts found for userId: ${userId}`);
            } else {
                this._logger.info(`Fetched ${data.length} accounts for userId: ${userId}`);
            }

            return Utils.greaterThen0(data?.length) ? data : [];
        } catch (e) {
            this._logger.error(`Failed to fetch accounts for userId: ${userId}. Error: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Fetching accounts failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    async getAccount(userId: number, accountId: number): Promise<IAccount> {
        try {
            this._logger.info(`Fetching account with accountId: ${accountId} for userId: ${userId}`);

            const data = await this.getAccountBaseQuery()
                .innerJoin('currencies', 'accounts.currencyId', 'currencies.currencyId')
                .where({ userId, accountId, status: AccountStatusType.Enable })
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
            const allowedProperties = {
                accountName: properties.accountName,
                amount: properties.amount,
                updatedAt: new Date().toISOString(),
                status: properties.status,
            };

            const allowedKeys = ['accountName', 'amount', 'updatedAt', 'status'];
            validateAllowedProperties(allowedProperties, allowedKeys);
            const properestForUpdate = getOnlyNotEmptyProperties(allowedProperties, allowedKeys);
            const query = trx || this._db.engine();
            const data = await query('accounts').update(properestForUpdate).where({ userId, accountId });

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
    async deleteAccount(userId: number, accountId: number, trx?: IDBTransaction): Promise<boolean> {
        try {
            this._logger.info(`Delete accountID: ${accountId} for userId: ${userId}`);

            const query = trx || this._db.engine();
            const data = await query('accounts').delete().where({ userId, accountId });
            if (!data) {
                throw new NotFoundError({
                    message: `Account with accountId: ${accountId} not found for userId: ${userId}`,
                });
            }
            this._logger.info(`Account accountId: ${accountId} for userId: ${userId} delete successful`);
            return true;
        } catch (e) {
            this._logger.error(
                `Failed account deleting with accountId: ${accountId} for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Delete account failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
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
