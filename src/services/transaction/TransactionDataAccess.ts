import { ITransactionDataAccess } from 'interfaces/ITransactionDataAccess';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { ITransaction } from 'interfaces/ITransaction';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { DBError } from 'src/utils/errors/DBError';
import Utils from 'src/utils/Utils';
import { NotFoundError } from 'src/utils/errors/NotFoundError';
import { BaseError } from 'src/utils/errors/BaseError';
import { isBaseError } from 'src/utils/errors/isBaseError';

export default class TransactionDataAccess extends LoggerBase implements ITransactionDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }
    async createTransaction(transaction: ICreateTransaction, trx?: IDBTransaction): Promise<number> {
        try {
            this._logger.info(`Starting transaction creation for userId: ${transaction.userId}`);

            const query = trx || this._db.engine();
            const data = await query('transactions').insert(
                {
                    accountId: transaction.accountId,
                    incomeId: transaction.incomeId,
                    categoryId: transaction.categoryId,
                    currencyId: transaction.currencyId,
                    transactionTypeId: transaction.transactionTypeId,
                    amount: transaction.amount,
                    description: transaction.description,
                    userId: transaction.userId,
                    createAt: transaction.createAt,
                    targetAccountId: transaction.targetAccountId,
                },
                ['transactionId'],
            );

            this._logger.info(`Successfully created ${data.length} transactions for userId: ${transaction.userId}`);
            return data[0].transactionId;
        } catch (e) {
            this._logger.error(
                `Failed to create transactions for userId: ${transaction.userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Transaction creation failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }

    async getTransactions(userId: number): Promise<ITransaction[] | undefined> {
        try {
            this._logger.info(`Fetching all transactions for userId: ${userId}`);

            const data = await this.getTransactionBaseQuery()
                .innerJoin('currencies', 'transactions.currencyId', 'currencies.currencyId')
                .where({ userId });

            if (!data.length) {
                this._logger.info(`No transactions found for userId: ${userId}`);
            } else {
                this._logger.info(`Fetched ${data.length} transactions for userId: ${userId}`);
            }

            return data;
        } catch (e) {
            this._logger.error(
                `Failed to fetch transactions for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Fetching transactions failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }

    async getTransaction(userId: number, transactionId: number): Promise<ITransaction | undefined> {
        try {
            this._logger.info(`Fetching transaction with transactionId: ${transactionId} for userId: ${userId}`);

            const data = await this.getTransactionBaseQuery()
                .innerJoin('currencies', 'transactions.currencyId', 'currencies.currencyId')
                .where({ userId, transactionId })
                .first();

            if (!data) {
                throw new NotFoundError({
                    message: `Transaction with transactionId: ${transactionId} not found for userId: ${userId}`,
                });
            } else {
                this._logger.info(`Fetched transaction with transactionId: ${transactionId} for userId: ${userId}`);
            }

            return data;
        } catch (e) {
            this._logger.error(
                `Failed to fetch transaction with transactionId: ${transactionId} for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Fetching transaction failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    async patchTransaction(userId: unknown, properties: Partial<ITransaction>, trx?: IDBTransaction): Promise<number> {
        const { transactionId } = properties;
        try {
            this._logger.info(`Patch transactionId: ${transactionId} for userId: ${userId}`);
            const query = trx || this._db.engine();
            console.log(properties);
            const data = await query('transactions')
                .update(this.sanitizePatchTransactionPropeties(properties))
                .where({ userId, transactionId });

            if (!data) {
                throw new NotFoundError({
                    message: `Transaction with transactionId: ${transactionId} not found for userId: ${userId}`,
                });
            } else {
                this._logger.info(`Transaction transactionId: ${transactionId} for userId: ${userId} patched successful`);
            }
            return data;
        } catch (e) {
            this._logger.error(
                `Failed to patch transaction with transactionId: ${transactionId} for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Patch transaction failed due to a database error: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    async deleteTransaction(userId: number, transactionId: number, trx?: IDBTransaction): Promise<boolean> {
        try {
            this._logger.info(`Delete transactionId: ${transactionId} for userId: ${userId}`);

            const query = trx || this._db.engine();
            const data = await query('transactions').delete().where({ userId, transactionId });
            if (!data) {
                throw new NotFoundError({
                    message: `Transaction with transactionId: ${transactionId} not found for userId: ${userId}`,
                });
            }
            this._logger.info(`Transaction transactionId: ${transactionId} for userId: ${userId} delete successful`);
            return true;
        } catch (e) {
            this._logger.error(
                `Failed transaction deleting with transactionId: ${transactionId} for userId: ${userId}. Error: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Delete transaction failed due to a database error: ${(e as { message: string }).message}`,
            });
        }
    }

    protected sanitizePatchTransactionPropeties(properties: Partial<ITransaction>): Partial<ITransaction> {
        const allowedProperties = Object.entries({
            accountId: properties.accountId,
            incomeId: properties.incomeId,
            categoryId: properties.categoryId,
            amount: properties.amount,
            description: properties.description,
            targetAccountId: properties.targetAccountId,
            createAt: properties.createAt,
            updateAt: new Date().toISOString(),
        }).reduce(
            (acc, [key, value]) => {
                if (key === 'description' || !Utils.isNull(value)) {
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

    protected getTransactionBaseQuery() {
        return this._db
            .engine()('transactions')
            .select(
                'transactions.transactionId',
                this._db.engine().raw('CAST(transactions.amount AS DECIMAL) as amount'),
                'transactions.categoryId',
                'transactions.accountId',
                'transactions.incomeId',
                'transactions.description',
                'transactions.createAt',
                'transactions.updateAt',
                'transactions.currencyId',
                'transactions.targetAccountId',
                'transactions.transactionTypeId',
                'currencies.currencyCode',
                'currencies.currencyName',
                'currencies.symbol',
            );
    }
}
