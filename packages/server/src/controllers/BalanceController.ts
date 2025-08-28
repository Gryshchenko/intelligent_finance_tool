import { Request, Response } from 'express';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import BalanceServiceBuilder from 'services/balance/BalanceServiceBuilder';

export class BalanceController {
    private static readonly logger = Logger.Of('BalanceController');
    public static async get(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const userId = Number(req.user?.userId);
            const balance = await BalanceServiceBuilder.build().get(userId);
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData(balance).build());
        } catch (e: unknown) {
            BalanceController.logger.error(`Convert failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.INCOME_ERROR);
        }
    }
}
