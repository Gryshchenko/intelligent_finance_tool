import { Request, Response } from 'express';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ErrorCode } from 'tenpercent/shared';
import Logger from 'helper/logger/Logger';
import { HttpCode } from 'tenpercent/shared';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import { ResponseStatusType } from 'tenpercent/shared';
import EmailConfirmationServiceBuilder from 'services/emailConfirmation/EmailConfirmationServiceBuilder';
import { CustomError } from 'src/utils/errors/CustomError';

export class EmailConfirmationController {
    private static readonly logger = Logger.Of('EmailConfirmationController');

    public static async verify(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const { confirmationCode } = req.body;
            const userId = Number(req.user?.userId);
            const email = String(req.user?.email);
            const response = await EmailConfirmationServiceBuilder.build().confirmEmail(userId, email, Number(confirmationCode));
            res.status(HttpCode.OK).json(
                responseBuilder
                    .setStatus(ResponseStatusType.OK)
                    .setData({
                        confirmationId: response.confirmationId,
                        status: response.status,
                    })
                    .build(),
            );
        } catch (e: unknown) {
            EmailConfirmationController.logger.error(` failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.EMAIL_CONFIRMATION_ERROR);
        }
    }

    public static async resend(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const userId = Number(req.user?.userId);
            const email = String(req.user?.email);
            const response = await EmailConfirmationServiceBuilder.build().resendConfirmationEmail(userId, email);
            if (response && response.expiresAt) {
                res.status(HttpCode.OK).json(
                    responseBuilder
                        .setStatus(ResponseStatusType.OK)
                        .setData({
                            expiresAt: response?.expiresAt,
                        })
                        .build(),
                );
            } else {
                throw new CustomError({
                    message: 'Email confirmation resend failed, new expiresAt empty',
                    statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                    errorCode: ErrorCode.EMAIL_CONFIRMATION_ERROR,
                });
            }
        } catch (e: unknown) {
            EmailConfirmationController.logger.error(` failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.EMAIL_CONFIRMATION_ERROR);
        }
    }
    public static async get(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const userId = Number(req.user?.userId);
            const email = String(req.user?.email);
            const response = await EmailConfirmationServiceBuilder.build().getEmailConfirmation(userId, email);
            res.status(HttpCode.OK).json(
                responseBuilder
                    .setStatus(ResponseStatusType.OK)
                    .setData({
                        confirmationId: response?.confirmationId,
                        expiresAt: response?.expiresAt,
                        status: response?.status,
                    })
                    .build(),
            );
        } catch (e: unknown) {
            EmailConfirmationController.logger.error(` failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.EMAIL_CONFIRMATION_ERROR);
        }
    }
}
