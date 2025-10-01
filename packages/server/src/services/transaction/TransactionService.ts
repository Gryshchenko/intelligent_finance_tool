import { ITransactionService } from 'interfaces/ITransactionService';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { ITransactionDataAccess } from 'interfaces/ITransactionDataAccess';
import { ITransaction } from 'tenpercent/shared/src/interfaces/ITransaction';
import { TransactionType } from 'types/TransactionType';
import { UnitOfWork } from 'src/repositories/UnitOfWork';
import { ValidationError } from 'src/utils/errors/ValidationError';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import Utils from 'src/utils/Utils';
import { CustomError } from 'src/utils/errors/CustomError';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { IAccountService } from 'interfaces/IAccountService';
import { IAccount } from 'tenpercent/shared/src/interfaces/IAccount';
import { IPatchTransaction } from 'interfaces/IPatchTransaction';
import { IPagination } from 'interfaces/IPagination';
import { IBalanceService } from 'interfaces/IBalanceService';
import { ITransactionListItem } from 'tenpercent/shared/src/interfaces/ITransactionListItem';
import { ITransactionListItemsRequest } from 'tenpercent/shared/src/interfaces/ITransactionListItemsRequest';

export default class TransactionService extends LoggerBase implements ITransactionService {
    private readonly _transactionDataAccess: ITransactionDataAccess;
    private readonly _accountService: IAccountService;
    private readonly _balanceService: IBalanceService;
    private readonly _db: IDatabaseConnection;

    public constructor(
        transactionDataAccess: ITransactionDataAccess,
        accountService: IAccountService,
        balanceService: IBalanceService,
        db: IDatabaseConnection,
    ) {
        super();
        this._transactionDataAccess = transactionDataAccess;
        this._accountService = accountService;
        this._balanceService = balanceService;
        this._db = db;
    }

    async createTransaction(transaction: ICreateTransaction): Promise<number | null> {
        switch (transaction.transactionTypeId) {
            case TransactionType.Expense: {
                return this.createExpenseTransaction(transaction);
            }
            case TransactionType.Income: {
                return this.createIncomeTransaction(transaction);
            }
            case TransactionType.Transafer: {
                return this.createTransfareTransaction(transaction);
            }
            default: {
                return null;
            }
        }
    }

    async deleteTransaction(userId: number, transactionId: number): Promise<boolean> {
        const uow = new UnitOfWork(this._db);
        try {
            await uow.start();
            const trxInProcess = uow.getTransaction();

            this.validateTrx(trxInProcess);

            const trx = trxInProcess as IDBTransaction;

            const transaction = await this._transactionDataAccess.getTransaction(userId, transactionId, trx);
            const result = await this._transactionDataAccess.deleteTransaction(userId, transactionId, trx);
            if (!transaction) {
                throw new ValidationError({
                    message: 'Transaction could not be deleted',
                });
            }
            await this._balanceService.patch(
                userId,
                {
                    amount: transaction?.amount * -1,
                    currencyCode: transaction.currencyCode,
                },
                trx,
            );
            await uow.commit();
            return result;
        } catch (e) {
            this._logger.error(
                `Delete transaction failed for userId=${userId}, transactionId=${transactionId}: ${(e as { message: string }).message}`,
                e,
            );
            await uow.rollback();
            throw e;
        }
    }
    async patchTransaction(userId: number, transaction: IPatchTransaction): Promise<number | null> {
        const uow = new UnitOfWork(this._db);
        try {
            await uow.start();
            const trxInProcess = uow.getTransaction();

            this.validateTrx(trxInProcess);

            const trx = trxInProcess as IDBTransaction;

            const trs = await this._transactionDataAccess.getTransaction(userId, transaction?.transactionId, trx);
            const result = await this._transactionDataAccess.patchTransaction(userId, transaction, trx);
            if (!trs) {
                throw new ValidationError({
                    message: 'Transaction could not be deleted',
                });
            }
            if (Utils.isNotNull(transaction.amount)) {
                const delta = transaction.amount - trs.amount;
                await this._balanceService.patch(
                    userId,
                    {
                        amount: delta,
                        currencyCode: trs.currencyCode,
                    },
                    trx,
                );
            }
            await uow.commit();
            return result;
        } catch (e) {
            this._logger.error(
                `Patch transaction failed for userId=${userId}, transactionId=${transaction.transactionId}: ${(e as { message: string }).message}`,
                e,
            );
            await uow.rollback();
            throw e;
        }
    }
    async getTransaction(userId: number, transactionId: number): Promise<ITransaction | undefined> {
        return await this._transactionDataAccess.getTransaction(userId, transactionId);
    }
    async getTransactions(data: ITransactionListItemsRequest): Promise<IPagination<ITransactionListItem | null>> {
        return await this._transactionDataAccess.getTransactions(data);
    }
    private async createIncomeTransaction(transaction: ICreateTransaction): Promise<number> {
        return this.processTransaction(
            transaction,
            async ({ transactionAmount, accountId, userId, trx }) => {
                const accountInWork = await this._accountService.getAccount(userId, accountId as number);

                this.validateAccount(accountInWork);

                const currentAmount = (accountInWork as IAccount).amount;
                const newAmount = Utils.roundNumber(currentAmount) + Utils.roundNumber(transactionAmount);
                await this._balanceService.patch(
                    userId,
                    { amount: transactionAmount, currencyCode: accountInWork?.currencyCode as string },
                    trx,
                );

                await this._accountService.patchAccount(userId, accountId as number, { amount: newAmount }, trx);
            },
            'income',
        );
    }

    private async createExpenseTransaction(transaction: ICreateTransaction): Promise<number> {
        return this.processTransaction(
            transaction,
            async ({ transactionAmount, accountId, userId, trx }) => {
                const accountInWork = await this._accountService.getAccount(userId, accountId as number);

                this.validateAccount(accountInWork);

                const currentAmount = (accountInWork as IAccount).amount;
                const newAmount = Utils.roundNumber(currentAmount) - Utils.roundNumber(transactionAmount);
                await this._balanceService.patch(
                    userId,
                    { amount: transactionAmount * -1, currencyCode: accountInWork?.currencyCode as string },
                    trx,
                );

                await this._accountService.patchAccount(userId, accountId as number, { amount: newAmount }, trx);
            },
            'expense',
        );
    }

    private async createTransfareTransaction(transaction: ICreateTransaction): Promise<number> {
        return this.processTransaction(
            transaction,
            async ({ transactionAmount, accountId, userId, trx, targetAccountId }) => {
                if (!targetAccountId) {
                    throw new ValidationError({
                        message: 'Target account is required for transfer transaction',
                        errorCode: ErrorCode.ACCOUNT_ERROR,
                        payload: {
                            field: 'targetAccountId',
                            reason: 'not_found',
                        },
                    });
                }

                const sourceAccount = await this._accountService.getAccount(userId, accountId);
                const targetAccount = await this._accountService.getAccount(userId, targetAccountId);

                this.validateAccount(sourceAccount);
                this.validateAccount(targetAccount);

                const newSourceAmount =
                    Utils.roundNumber((sourceAccount as IAccount).amount) - Utils.roundNumber(transactionAmount);
                const newTargetAmount =
                    Utils.roundNumber((targetAccount as IAccount).amount) + Utils.roundNumber(transactionAmount);

                await this._accountService.patchAccount(userId, accountId, { amount: newSourceAmount }, trx);
                await this._accountService.patchAccount(userId, targetAccountId, { amount: newTargetAmount }, trx);
            },
            'transfare',
        );
    }

    private async processTransaction(
        transaction: ICreateTransaction,
        operation: ({
            transactionAmount,
            trx,
            accountId,
            userId,
            targetAccountId,
            currencyId,
        }: {
            currencyId?: number;
            transactionAmount: number;
            trx: IDBTransaction;
            accountId: number;
            userId: number;
            targetAccountId?: number;
        }) => Promise<void>,
        transactionType: 'income' | 'expense' | 'transfare',
    ): Promise<number> {
        const uow = new UnitOfWork(this._db);
        try {
            const { amount, userId, targetAccountId, accountId, currencyId } = transaction;
            await uow.start();

            const trxInProcess = uow.getTransaction();
            this.validateTrx(trxInProcess);

            const trx = trxInProcess as IDBTransaction;

            await operation({
                transactionAmount: Math.abs(amount),
                accountId,
                userId,
                targetAccountId,
                currencyId,
                trx,
            });

            const transactionId = await this._transactionDataAccess.createTransaction(transaction, trx);

            await uow.commit();

            return transactionId;
        } catch (e) {
            this._logger.error(
                `Transaction ${transactionType} failed for userId=${transaction.userId}, accountId=${transaction.accountId}: ${(e as { message: string }).message}`,
                e,
            );
            await uow.rollback();
            throw e;
        }
    }

    private validateAccount(account: IAccount | undefined): void {
        const error = (reason: string) => {
            throw new ValidationError({
                message: `Creating expense transaction failed, due reason ${reason}`,
                errorCode: ErrorCode.TRANSACTION_ERROR,
            });
        };
        if (Utils.isNull(account) || Utils.isNull(account?.amount) || Utils.isNull(account?.currencyId)) {
            error('account = null');
        }
        const { amount, currencyId } = account as IAccount;
        if (Utils.isNull(currencyId)) {
            error('currencyId = null');
        }
        if (Utils.isNull(amount)) {
            error('amount= null');
        }
    }

    private validateTrx(trxInProcess: IDBTransaction | null): void {
        if (Utils.isNull(trxInProcess)) {
            throw new CustomError({
                message: 'Transaction not initiated. User could not be created',
                errorCode: ErrorCode.TRANSACTION_ERROR,
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
            });
        }
    }
    public async deleteTransactionsForAccount(userId: number, accountId: number, trx?: IDBTransaction): Promise<boolean> {
        return await this._transactionDataAccess.deleteTransactionsForAccount(userId, accountId, trx);
    }
}
