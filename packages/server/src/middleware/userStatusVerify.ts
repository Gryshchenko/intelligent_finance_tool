import { Request, Response, NextFunction } from 'express';
import Logger from 'helper/logger/Logger';
import { IUserSession } from 'interfaces/IUserSession';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

const _logger = Logger.Of('UserStatusVerify');

const userStatusVerify = (requiredStatus: UserStatus) => (req: Request, res: Response, next: NextFunction) => {
    const userFromSession = req.session.user as IUserSession;
    if (requiredStatus !== userFromSession.status) {
        const responseBuilder = new ResponseBuilder();
        _logger.error(`User status verification failed, access with status: ${userFromSession.status} not allowed`);
        return res.status(HttpCode.FORBIDDEN).json(
            responseBuilder
                .setStatus(ResponseStatusType.INTERNAL)
                .setError({ errorCode: ErrorCode.USER_ERROR, payload: { field: 'userStatus', reason: 'not-found' } })
                .build(),
        );
    }
    _logger.info('User status verified successfully');
    next();
};

export default userStatusVerify;
