import { Request, Response, NextFunction } from 'express';
import { ResponseBuilderPreset } from 'helper/responseBuilder/ResponseBuilderPreset';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import passport from 'passport';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import { extractToken } from 'tenpercent/shared/src/utils/extractToken';
import TokenBlacklistBuilder from 'services/auth/TokenBlacklistBuilder';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';

const _logger = Logger.Of('TokenVerify');

export const tokenVerify = async (req: Request, res: Response, next: NextFunction) => {
    const responseBuilder = new ResponseBuilder();

    const token = extractToken(req.headers.authorization);

    if (!token || typeof token !== 'string') {
        _logger.error('No token provided');
        return res.status(HttpCode.UNAUTHORIZED).json(ResponseBuilderPreset.getAuthError());
    }

    const blacklist = TokenBlacklistBuilder.build();
    try {
        if (await blacklist.isBlacklisted(token)) {
            _logger.warn('Token is blacklisted');
            return res
                .status(HttpCode.UNAUTHORIZED)
                .json(
                    responseBuilder
                        .setStatus(ResponseStatusType.INTERNAL)
                        .setData({ errorCode: ErrorCode.TOKEN_INVALID_ERROR })
                        .build(),
                );
        }
    } catch (err) {
        _logger.error('Error checking token blacklist', err);
        return res
            .status(HttpCode.SERVICE_UNAVAILABLE)
            .json(responseBuilder.setStatus(ResponseStatusType.INTERNAL).setData({}).build());
    }
    return passport.authenticate(
        'jwt',
        { session: false },
        (err: unknown, user?: Express.User | false | null, info?: { name: string; message: string }) => {
            if (err) {
                _logger.error('JWT system error', err);
                return res
                    .status(HttpCode.SERVICE_UNAVAILABLE)
                    .json(new ResponseBuilder().setStatus(ResponseStatusType.INTERNAL).setData({}).build());
            }
            if (!user) {
                let message = 'Unauthorized';
                let obj = null;

                if (info) {
                    if (info.name === 'TokenExpiredError') {
                        message = 'Token expired';
                        obj = ResponseBuilderPreset.getTokenExpired();
                    } else if (info.name === 'JsonWebTokenError') {
                        message = 'Invalid token';
                        obj = ResponseBuilderPreset.getAuthError();
                    } else if (typeof info === 'string') {
                        message = info;
                        obj = ResponseBuilderPreset.getAuthError();
                    } else if (info.message) {
                        obj = ResponseBuilderPreset.getAuthError();
                        message = info.message;
                    }
                }

                _logger.error(`JWT validation failed due reason: ${message}`);
                return res.status(HttpCode.UNAUTHORIZED).json(obj);
            }

            req.user = user;
            return next();
        },
    )(req, res, next);
};

export default tokenVerify;
