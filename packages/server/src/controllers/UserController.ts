import { Request, Response } from 'express';
import Logger from 'helper/logger/Logger';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { IUserSession } from 'interfaces/IUserSession';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import UserServiceBuilder from 'services/user/UserServiceBuilder';

export class UserController {
    private static readonly logger = Logger.Of('UserController');
    public static async get(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const userFromSession = req.session.user as IUserSession;
            const response = await UserServiceBuilder.build().get(userFromSession.userId);
            res.status(HttpCode.OK).json(
                responseBuilder
                    .setStatus(ResponseStatusType.OK)
                    .setData({ userId: response.userId, status: response.status, email: response.email })
                    .build(),
            );
        } catch (e: unknown) {
            UserController.logger.error(`Fetch user failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.USER_ERROR);
        }
    }
}
