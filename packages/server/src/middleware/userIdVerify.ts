import { Request, Response, NextFunction } from 'express';
import Logger from 'helper/logger/Logger';
import { IUserSession } from 'interfaces/IUserSession';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import Utils from 'src/utils/Utils';

const _logger = Logger.Of('UserIdVerify');

const userIdVerify = (req: Request, res: Response, next: NextFunction) => {
    const userFromSession = req.session.user as IUserSession;
    if (
        Utils.isNull(req.params?.userId) ||
        Utils.isNull(userFromSession?.userId) ||
        parseInt(req.params?.userId) !== userFromSession?.userId
    ) {
        const responseBuilder = new ResponseBuilder();
        _logger.error('UserId verified failed');
        return res
            .status(HttpCode.FORBIDDEN)
            .json(responseBuilder.setStatus(ResponseStatusType.INTERNAL).setError({ errorCode: ErrorCode.AUTH_ERROR }).build());
    }
    _logger.info('UserId verified successfully');
    next();
};

export default userIdVerify;
