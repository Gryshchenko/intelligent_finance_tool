import { ITransactionService } from 'interfaces/ITransactionService';
import { ICreateTransaction } from 'interfaces/ICreateTransaction';
import { ITransactionDataAccess } from 'interfaces/ITransactionDataAccess';
import { ITransaction } from 'interfaces/ITransaction';
import { TransactionType } from 'types/TransactionType';
import { UnitOfWork } from 'src/repositories/UnitOfWork';
import { ValidationError } from 'src/utils/errors/ValidationError';
import { ErrorCode } from 'types/ErrorCode';
import Utils from 'src/utils/Utils';
import { CustomError } from 'src/utils/errors/CustomError';
import { HttpCode } from 'types/HttpCode';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { IAccountService } from 'interfaces/IAccountService';
import { IAccount } from 'interfaces/IAccount';
import { IPatchTransaction } from 'interfaces/IPatchTransaction';
import { IPagination } from 'interfaces/IPagination';
import { IBalanceService } from 'interfaces/IBalanceService';

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
        return await this._transactionDataAccess.deleteTransaction(userId, transactionId);
    }
    async patchTransaction(userId: number, transaction: IPatchTransaction): Promise<number | null> {
        return await this._transactionDataAccess.patchTransaction(userId, transaction);
    }
    async getTransaction(userId: number, transactionId: number): Promise<ITransaction | undefined> {
        return await this._transactionDataAccess.getTransaction(userId, transactionId);
    }
    async getTransactions({
        userId,
        limit,
        cursor,
    }: {
        userId: number;
        limit: number;
        cursor: number;
    }): Promise<IPagination<ITransaction | null>> {
        return await this._transactionDataAccess.getTransactions({ userId, limit, cursor });
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
                    { amount: newAmount, currencyCode: accountInWork?.currencyCode as string },
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
                        errorCode: ErrorCode.TARGET_ACCOUNT_ID_ERROR,
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
                errorCode: ErrorCode.SIGNUP_TRANSACTION,
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
            });
        }
    }
    public async deleteTransactionsForAccount(userId: number, accountId: number, trx?: IDBTransaction): Promise<boolean> {
        return await this._transactionDataAccess.deleteTransactionsForAccount(userId, accountId, trx);
    }
}
