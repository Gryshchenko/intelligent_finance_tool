import { Request, Response } from 'express';
import Logger from 'helper/logger/Logger';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import UserRegistrationServiceBuilder from 'services/registration/UserRegistrationServiceBuilder';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import SessionService from 'services/session/SessionService';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import { IUserSession } from 'interfaces/IUserSession';
import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

export class RegisterController {
    private static readonly logger = Logger.Of('RegisterController');
    public static async signup(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();

        try {
            const response = await UserRegistrationServiceBuilder.build().createUser(
                req.body.email,
                req.body.password,
                req.body.locale,
                req.body.publicName,
            );
            const { user, token } = response;
            SessionService.handleSessionRegeneration(
                req,
                res,
                {
                    userId: user.userId,
                    email: user.email,
                    status: UserStatus.NO_VERIFIED,
                },
                token,
                RegisterController.logger,
                responseBuilder,
                () => {
                    res.status(HttpCode.OK).json(
                        responseBuilder.setStatus(ResponseStatusType.OK).setData({ userId: user.userId }).build(),
                    );
                },
            );
        } catch (e: unknown) {
            RegisterController.logger.error(`Signup failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.SIGNUP_CATCH_ERROR);
        }
    }
    public static async signUpConfirmMail(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const userFromSession = req.session.user as IUserSession;
            await UserRegistrationServiceBuilder.build().confirmUserMail(
                userFromSession.userId,
                userFromSession.email,
                Number(req.body.confirmationCode),
            );
            SessionService.handleSessionRegeneration(
                req,
                res,
                {
                    userId: userFromSession.userId,
                    email: userFromSession.email,
                    status: UserStatus.ACTIVE,
                },
                userFromSession.token,
                RegisterController.logger,
                responseBuilder,
                () => {
                    res.status(HttpCode.NO_CONTENT).json(responseBuilder.setStatus(ResponseStatusType.OK).setData({}).build());
                },
            );
        } catch (e: unknown) {
            RegisterController.logger.error(`Signup confirm mail failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.EMAIL_VERIFICATION_FAILED);
        }
    }
}
