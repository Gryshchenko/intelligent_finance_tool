import { Request, Response } from 'express';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ErrorCode } from 'tenpercent/shared';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'tenpercent/shared';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import { ResponseStatusType } from 'tenpercent/shared';
import { Utils } from 'tenpercent/shared';
import { ValidationError } from 'src/utils/errors/ValidationError';
import ExchangeRateServiceBuilder from 'services/exchangeRateService/ExchangeRateServiceBuilder';

export class ExchangeRateController {
    private static readonly logger = Logger.Of('ExchangeRateController');
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
            const rate = await ExchangeRateServiceBuilder.build().get(currency, targetCurrency);
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData(rate).build());
        } catch (e: unknown) {
            ExchangeRateController.logger.error(`Convert failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.INCOME_ERROR);
        }
    }
}
