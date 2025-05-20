import { Request, Response } from 'express';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ResponseStatusType } from 'types/ResponseStatusType';
import { ErrorCode } from 'types/ErrorCode';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'types/HttpCode';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import TransactionServiceBuilder from 'services/transaction/TransactionServiceBuilder';
import Utils from 'src/utils/Utils';
import { ITransaction } from 'interfaces/ITransaction';

export class TransactionController {
    private static readonly logger = Logger.Of('TransactionController');

    public static async delete(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            await TransactionServiceBuilder.build().deleteTransaction(
                req.session.user?.userId as number,
                Number(req.params.transactionId),
            );
            res.status(HttpCode.NO_CONTENT).json(responseBuilder.setStatus(ResponseStatusType.OK).setData({}).build());
        } catch (e: unknown) {
            TransactionController.logger.error(`Delete transaction failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.TRANSACTION_ERROR);
        }
    }
    public static async get(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const transaction = await TransactionServiceBuilder.build().getTransaction(
                req.session.user?.userId as number,
                Number(req.params.transactionId),
            );
            if (Utils.isNull(transaction) || Utils.isObjectEmpty(transaction as unknown as Record<string, unknown>)) {
                res.status(HttpCode.NO_CONTENT).json(responseBuilder.setStatus(ResponseStatusType.OK).setData({}).build());
            } else {
                res.status(HttpCode.OK).json(
                    responseBuilder
                        .setStatus(ResponseStatusType.OK)
                        .setData({
                            transactionId: transaction?.transactionId,
                            accountId: transaction?.accountId,
                            targetAccountId: transaction?.targetAccountId,
                            incomeId: transaction?.incomeId,
                            categoryId: transaction?.categoryId,
                            currencyId: transaction?.currencyId,
                            currencyCode: transaction?.currencyCode,
                            currencyName: transaction?.currencyName,
                            symbol: transaction?.symbol,
                            transactionTypeId: transaction?.transactionTypeId,
                            amount: transaction?.amount,
                            description: transaction?.description,
                            createAt: transaction?.createAt,
                        })
                        .build(),
                );
            }
        } catch (e: unknown) {
            TransactionController.logger.error(`Get transaction failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.TRANSACTION_ERROR);
        }
    }

    public static async getAll(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const { data, limit, cursor } = await TransactionServiceBuilder.build().getTransactions({
                userId: req.session.user?.userId as number,
                limit: Number(req.query.limit),
                cursor: Number(req.query.cursor),
            });
            const transactionCount = data?.length ?? 0;
            if (Utils.isNull(data) || !Utils.greaterThen0(transactionCount)) {
                res.status(HttpCode.OK).json(
                    responseBuilder
                        .setStatus(ResponseStatusType.OK)
                        .setData({
                            limit,
                            cursor,
                            data: [],
                        })
                        .build(),
                );
            } else {
                const response = {
                    limit,
                    cursor,
                    data: data.map((transaction: ITransaction | null) => ({
                        transactionId: transaction?.transactionId,
                        accountId: transaction?.accountId,
                        targetAccountId: transaction?.targetAccountId,
                        incomeId: transaction?.incomeId,
                        categoryId: transaction?.categoryId,
                        currencyId: transaction?.currencyId,
                        transactionTypeId: transaction?.transactionTypeId,
                        amount: transaction?.amount,
                        description: transaction?.description,
                        createAt: transaction?.createAt,
                    })),
                };
                res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData(response).build());
            }
        } catch (e: unknown) {
            TransactionController.logger.error(`Get transactions failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.TRANSACTION_ERROR);
        }
    }

    public static async create(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const {
                accountId,
                incomeId,
                categoryId,
                currencyId,
                transactionTypeId,
                amount,
                description,
                createAt = new Date().toISOString(),
                targetAccountId,
            } = req.body;
            const transactionId = await TransactionServiceBuilder.build().createTransaction({
                accountId,
                incomeId,
                categoryId,
                currencyId,
                transactionTypeId,
                amount,
                description,
                userId: req.session.user?.userId as number,
                createAt,
                targetAccountId,
            });
            res.status(HttpCode.CREATED).json(
                responseBuilder.setStatus(ResponseStatusType.OK).setData({ transactionId }).build(),
            );
        } catch (e: unknown) {
            TransactionController.logger.error(`Create transaction failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.TRANSACTION_ERROR);
        }
    }

    public static async patch(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const { accountId, incomeId, categoryId, currencyId, amount, description, createAt, targetAccountId } = req.body;
            await TransactionServiceBuilder.build().patchTransaction(req.session.user?.userId as number, {
                transactionId: Number(req.params.transactionId),
                accountId,
                incomeId,
                categoryId,
                currencyId,
                amount,
                description,
                createAt,
                targetAccountId,
            });
            res.status(HttpCode.NO_CONTENT).json(responseBuilder.setStatus(ResponseStatusType.OK).setData({}).build());
        } catch (e: unknown) {
            TransactionController.logger.error(`Patch transaction failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.TRANSACTION_ERROR);
        }
    }
}
