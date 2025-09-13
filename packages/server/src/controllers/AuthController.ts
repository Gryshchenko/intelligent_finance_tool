import { Request, Response } from 'express';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import Logger from 'helper/logger/Logger';
import { validationResult } from 'express-validator';
import AuthServiceBuilder from 'services/auth/AuthServiceBuilder';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import UserServiceUtils from 'services/user/UserServiceUtils';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { ValidationError } from 'src/utils/errors/ValidationError';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { extractToken } from 'tenpercent/shared/src/utils/extractToken';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import { IUser } from 'interfaces/IUser';
import { CustomError } from 'src/utils/errors/CustomError';
import { RoleType } from 'tenpercent/shared/src/types/RoleType';

export class AuthController {
    private static readonly logger = Logger.Of('AuthController');

    public static async verify(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const session = req.user as IUser;
            if (!session || !session.userId) {
                throw new ValidationError({
                    message: 'User in JWT session not found',
                    statusCode: HttpCode.UNAUTHORIZED,
                    errorCode: ErrorCode.AUTH_ERROR,
                });
            }
            res.status(HttpCode.OK).json(
                responseBuilder
                    .setStatus(ResponseStatusType.OK)
                    .setData({
                        userId: session.userId,
                        email: session.email,
                        status: session.status,
                    })
                    .build(),
            );
        } catch (e) {
            AuthController.logger.info(`Verify failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.TOKEN_INVALID_ERROR);
        }
    }

    public static async refresh(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const token = String(req.body.token);
            const user = req.user;
            const userId = Number(user?.userId);
            const newToken = await AuthServiceBuilder.build().refresh(token, userId, RoleType.Default);
            res.setHeader('Authorization', `Bearer ${newToken}`);
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).setData({ token: newToken }).build());
        } catch (e) {
            AuthController.logger.info(`Verify failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.TOKEN_LONG_INVALID_ERROR);
        }
    }

    public static async logout(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const token = extractToken(req.headers.authorization);
            if (!token) {
                throw new CustomError({
                    message: 'Token not provided',
                    statusCode: HttpCode.UNAUTHORIZED,
                    errorCode: ErrorCode.TOKEN_INVALID_ERROR,
                });
            }

            await AuthServiceBuilder.build().logout(token as string);
            AuthController.logger.info('Logout successful');
            res.status(HttpCode.OK).json(responseBuilder.setStatus(ResponseStatusType.OK).build());
        } catch (e) {
            AuthController.logger.info(`Logout failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.AUTH_ERROR);
        }
    }

    public static async login(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError({ message: 'login validation error' });
            }
            const { user, token, longToken } = await AuthServiceBuilder.build().login(
                req.body.email.toLocaleLowerCase(),
                req.body.password,
            );
            res.setHeader('Authorization', `Bearer ${token}`);
            res.status(HttpCode.OK).json(
                responseBuilder
                    .setStatus(ResponseStatusType.OK)
                    .setData({ ...UserServiceUtils.convertServerUserToClientUser(user, longToken, token) })
                    .build(),
            );
        } catch (e: unknown) {
            AuthController.logger.error(`Use login failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.AUTH_ERROR);
        }
    }
}
