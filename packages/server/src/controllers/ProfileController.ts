import { Request, Response } from 'express';
import Logger from 'helper/logger/Logger';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import ProfileServiceBuilder from 'services/profile/ProfileServiceBuilder';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import ProfileServiceUtils from 'services/profile/ProfileServiceUtils';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { generateErrorResponse } from 'src/utils/generateErrorResponse';
import { BaseError } from 'src/utils/errors/BaseError';
import { IUser } from 'interfaces/IUser';

export class ProfileController {
    private static readonly logger = Logger.Of('ProfileController');
    public static async get(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            const userFromSession = req.user as IUser;
            const profileService = ProfileServiceBuilder.build();
            const response = await profileService.get(userFromSession.userId);
            res.status(HttpCode.OK).json(
                responseBuilder
                    .setStatus(ResponseStatusType.OK)
                    .setData(ProfileServiceUtils.convertServerUserToClientUser(response))
                    .build(),
            );
        } catch (e: unknown) {
            ProfileController.logger.error(`Fetch profile failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.PROFILE_ERROR);
        }
    }

    public static async patch(req: Request, res: Response) {
        const responseBuilder = new ResponseBuilder();
        try {
            res.status(HttpCode.NOT_IMPLEMENTED).json(responseBuilder.setStatus(ResponseStatusType.INTERNAL).setData({}).build());
        } catch (e: unknown) {
            ProfileController.logger.error(`Comfirm mail failed due reason: ${(e as { message: string }).message}`);
            generateErrorResponse(res, responseBuilder, e as BaseError, ErrorCode.PROFILE_ERROR);
        }
    }
}
