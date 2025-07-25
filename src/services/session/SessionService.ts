import { Request, Response } from 'express';
import { ResponseStatusType } from 'types/ResponseStatusType';
import { ErrorCode } from 'types/ErrorCode';
import { IUser } from 'interfaces/IUser';
import { IUserSession } from 'interfaces/IUserSession';
import ResponseBuilder from 'src/helper/responseBuilder/ResponseBuilder';
import { getConfig } from 'src/config/config';
import { IUserAgentInfo } from 'interfaces/IUserAgentInfo';
import { UserAgentService } from 'src/services/userAgentService/UserAgentService';
import Logger from 'helper/logger/Logger';

const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;

export default class SessionService {
    public static extractSessionFromRequest(req: Request): IUserSession | undefined {
        return req.session?.user;
    }

    public static deleteSession(req: Request, res: Response, cb: () => void): void {
        const _logger = Logger.Of('deleteSession');
        _logger.info('Starting session deletion procedure');

        req.session.destroy((err) => {
            if (err) {
                _logger.error(`Error deleting session: ${err.message}`);
                const responseBuilder = new ResponseBuilder();

                res.status(400).json(
                    responseBuilder
                        .setStatus(ResponseStatusType.INTERNAL)
                        .setError({
                            errorCode: ErrorCode.SESSION_DESTROY_ERROR,
                        })
                        .build(),
                );

                return;
            }

            res.clearCookie(getConfig().ssName, { path: '/' });
            _logger.info('Session successfully deleted');

            if (cb) {
                try {
                    cb();
                } catch (callbackError) {
                    _logger.error(`Callback execution error: ${(callbackError as { message: string })?.message}`);
                }
            }
        });
    }

    private static buildSessionObject(
        user: IUser,
        token: string,
        ip: string | undefined,
        sessionId: string,
        userAgent: IUserAgentInfo | undefined,
    ): IUserSession {
        return Object.freeze({
            userId: user.userId,
            sessionId,
            status: user.status,
            email: user.email,
            ip,
            token,
            userAgent,
        });
    }

    public static getUserIP(req: Request): string | undefined {
        return req.ip ?? req.socket.remoteAddress;
    }

    public static regenerateSession({
        req,
        user,
        err,
        handleError,
        handleSuccess,
        token,
    }: {
        req: Request;
        user: IUser;
        token: string;
        err?: string;
        handleError: (err: string) => void;
        handleSuccess: (id: string) => void;
    }): void {
        if (err) {
            handleError(err);
        }
        req.session.user = SessionService.buildSessionObject(
            user,
            token,
            SessionService.getUserIP(req),
            req.sessionID,
            UserAgentService.getUserAgent(req.headers['user-agent']),
        );
        req.session.save((err: string) => {
            if (err) {
                handleError(err);
            } else {
                handleSuccess(req.session.id);
            }
        });
    }

    public static setup(): typeof session {
        const redisClient = redis.createClient({
            host: getConfig().redisHost,
            port: getConfig().redisPort,
        });
        redisClient.connect().catch(Logger.Of('Redis').error);

        const redisStore = new RedisStore({
            client: redisClient,
            prefix: 'myapp:',
        });

        redisClient.on('error', (err: string) => {
            Logger.Of('Redis').error('Redis error: ', err);
        });
        redisClient.on('connect', function () {
            Logger.Of('Redis').info('Redis connect');
        });
        return session({
            store: redisStore,
            secret: getConfig().ssSecret,
            name: getConfig().ssName,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: true,
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            },
        });
    }

    public static handleSessionRegeneration(
        req: Request,
        res: Response,
        user: IUser,
        token: string,
        logger: Logger,
        responseBuilder: ResponseBuilder,
        handleSuccess: () => void,
        handleError?: (error: string) => void,
    ): void {
        req.session.regenerate((err) => {
            if (err) {
                logger.error(`Session regeneration error: ${err}`);
                res.status(400).json(
                    responseBuilder
                        .setStatus(ResponseStatusType.INTERNAL)
                        .setError({ errorCode: ErrorCode.SESSION_CREATE_ERROR })
                        .build(),
                );
                return;
            }

            SessionService.regenerateSession({
                err,
                user,
                token,
                req,
                handleError: (error: string) => {
                    logger.error(`Session regenerate error: ${error}`);
                    res.status(400).json(
                        responseBuilder
                            .setStatus(ResponseStatusType.INTERNAL)
                            .setError({ errorCode: ErrorCode.SESSION_CREATE_ERROR })
                            .build(),
                    );
                    if (handleError) {
                        handleError(error);
                    }
                },
                handleSuccess: (sessionId: string) => {
                    logger.info(`Session regenerated successfully: ${sessionId}`);
                    res.setHeader('Authorization', `Bearer ${token}`);
                    if (handleSuccess) {
                        handleSuccess();
                    }
                },
            });
        });
    }
}
