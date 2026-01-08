import { Request, Response } from 'express';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ErrorCode } from 'tenpercent/shared';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'tenpercent/shared';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import { ResponseStatusType } from 'tenpercent/shared';
import CurrencyServiceBuilder from 'services/currency/CurrencyServiceBuilder';

export class CurrencyController {
    private static readonly logger = Logger.Of('CurrencyController');
    public static async gets(_: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const response = await CurrencyServiceBuilder.build().gets();
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData(response).build());
        } catch (e: unknown) {
            CurrencyController.logger.error(`Get currency failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.CURRENCY_ERROR);
        }
    }
}
