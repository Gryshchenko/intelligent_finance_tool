import { Request, Response } from 'express';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ErrorCode } from 'types/ErrorCode';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'types/HttpCode';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import { ResponseStatusType } from 'types/ResponseStatusType';
import CurrencyServiceBuilder from 'services/currency/CurrencyServiceBuilder';
import Utils from 'src/utils/Utils';
import { ValidationError } from 'src/utils/errors/ValidationError';

export class CurrencyController {
    private static readonly logger = Logger.Of('CurrencyController');
    public static async get(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const currency: string = String(req.query.currency) as string;
            const targetCurrency: string = String(req.query.targetCurrency) as string;
            if (Utils.isEmpty(currency) || Utils.isEmpty(targetCurrency)) {
                throw new ValidationError({
                    message: `Conversation failed currency: ${currency} or target currency should not be empty: ${targetCurrency}`,
                });
            }
            const rate = await CurrencyServiceBuilder.build().getRate(currency, targetCurrency);
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData(rate).build());
        } catch (e: unknown) {
            CurrencyController.logger.error(`Convert failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.INCOME_ERROR);
        }
    }
}
