import { Request, Response, NextFunction } from 'express';
import { VerifyErrors } from 'jsonwebtoken';
import SessionService from '../services/session/SessionService';
import { getConfig } from 'src/config/config';
import { ResponseBuilderPreset } from 'helper/responseBuilder/ResponseBuilderPreset';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';

const jwt = require('jsonwebtoken');

const _logger = Logger.Of('TokenVerify');

const errorHandler = (errorMsg: string, code: number, req: Request, res: Response, type: string | null) => {
    _logger.error(errorMsg);
    res.status(code).json(type === 'expired' ? ResponseBuilderPreset.getTokenExpired() : ResponseBuilderPreset.getAuthError());
};

const tokenVerifyHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
    errorHandler: (errorMsg: string, type: string | null) => void,
) => {
    const token = extractToken(req);
    const userSession = SessionService.extractSessionFromRequest(req);

    if (!token) {
        errorHandler('Token verification failed: token is null', null);
        return;
    }

    if (!userSession?.token) {
        errorHandler('Token verification failed: session token is null', null);
        return;
    }
    jwt.verify(
        token,
        getConfig().jwtSecret ?? null,
        {
            algorithms: [getConfig().jwtAlgorithm],
            issuer: getConfig().jwtIssuer,
            audience: getConfig().jwtAudience,
        },
        (err: VerifyErrors & { complete: boolean }) => {
            if (err) {
                const errorType = err.name === 'TokenExpiredError' ? 'expired' : 'invalid';
                errorHandler(`Token verification failed: token is ${errorType}`, errorType);
            } else {
                _logger.info('Token verified successfully');
                next();
            }
        },
    );
};

const extractToken = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

const tokenVerify = (req: Request, res: Response, next: NextFunction) => {
    tokenVerifyHandler(req, res, next, (errorMsg, type: string | null) =>
        errorHandler(errorMsg, HttpCode.UNAUTHORIZED, req, res, type),
    );
};

export default tokenVerify;
