import { Request, Response } from 'express';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ErrorCode } from 'types/ErrorCode';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'types/HttpCode';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import AccountServiceBuilder from 'services/account/AccountServiceBuilder';
import { ResponseStatusType } from 'types/ResponseStatusType';
import Utils from 'src/utils/Utils';
import { ValidationError } from 'src/utils/errors/ValidationError';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import DatabaseConnectionBuilder from 'src/repositories/DatabaseConnectionBuilder';
import { UnitOfWork } from 'src/repositories/UnitOfWork';
import { CustomError } from 'src/utils/errors/CustomError';
import TransactionServiceBuilder from 'services/transaction/TransactionServiceBuilder';

export class AccountController {
    private static readonly logger = Logger.Of('AccountController');
    public static async get(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const accountId = Number(req.params?.accountId);
            const account = await AccountServiceBuilder.build().getAccount(req.session.user?.userId as number, accountId);
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData(account).build());
        } catch (e: unknown) {
            AccountController.logger.error(`Get account failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.ACCOUNT_ERROR);
        }
    }
    public static async gets(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const account = await AccountServiceBuilder.build().getAccounts(req.session.user?.userId as number);
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData(account).build());
        } catch (e: unknown) {
            AccountController.logger.error(`Create accounts failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.ACCOUNT_ERROR);
        }
    }
    public static async post(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const { accountName, amount, currencyId } = req.body;
            const account = await AccountServiceBuilder.build().createAccount(req.session.user?.userId as number, {
                accountName,
                amount,
                currencyId,
            });
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData(account).build());
        } catch (e: unknown) {
            AccountController.logger.error(`Create account failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.ACCOUNT_ERROR);
        }
    }
    public static async delete(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        const db: IDatabaseConnection = DatabaseConnectionBuilder.build();
        const uow = new UnitOfWork(db);
        try {
            const userId = Number(req.session.user?.userId);
            const accountId = Number(req.params?.accountId);
            const accountService = AccountServiceBuilder.build(db);
            const transactionService = TransactionServiceBuilder.build(db);
            await uow.start();
            const trx = uow.getTransaction();
            if (Utils.isNull(trx)) {
                throw new CustomError({
                    message: 'Transaction not initiated. User could not be created',
                    errorCode: ErrorCode.ACCOUNT_ERROR,
                    statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                });
            }
            await transactionService.deleteTransactionsForAccount(userId, accountId, trx as unknown as IDBTransaction);
            await accountService.deleteAccount(userId, accountId, trx as unknown as IDBTransaction);
            await uow.commit();
            res.status(HttpCode.NO_CONTENT).json(responseBuilder.setStatus(ResponseStatusType.OK).setData({}).build());
        } catch (e: unknown) {
            await uow.rollback();
            AccountController.logger.error(`Delete account failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.ACCOUNT_ERROR);
        }
    }
    public static async patch(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const accountId = Number(req.params?.accountId);
            const { accountName, amount, status } = req.body;
            if (Utils.isEmpty(accountName) && Utils.isNull(amount) && Utils.isNull(status)) {
                throw new ValidationError({ message: 'Path account failed due reason: empty body' });
            }
            await AccountServiceBuilder.build().patchAccount(req.session.user?.userId as number, accountId, {
                accountName,
                amount,
                status,
            });
            res.status(HttpCode.NO_CONTENT).json(responseBuilder.setStatus(ResponseStatusType.OK).setData({}).build());
        } catch (e: unknown) {
            AccountController.logger.error(`Patch account failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.ACCOUNT_ERROR);
        }
    }
}
