import { IUserServer } from 'interfaces/IUserServer';
import { IUser } from 'interfaces/IUser';
import { ValidationError } from 'src/utils/errors/ValidationError';
import Logger from 'helper/logger/Logger';

import argon2 from 'argon2';

import cryptoModule from 'crypto';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { IUserClient } from 'tenpercent/shared/src/interfaces/IUserClient';

const _logger = Logger.Of('UserServiceUtils');

export default class UserServiceUtils {
    public static getRandomSalt(): Buffer {
        return cryptoModule.randomBytes(16);
    }

    public static async verifyPassword(dbPassword: string, userPassword: string): Promise<boolean> {
        try {
            const result = await argon2.verify(dbPassword, userPassword);
            if (!result) {
                throw new ValidationError({ message: 'Password verification failed', errorCode: ErrorCode.AUTH_ERROR });
            }
            return result;
        } catch (e) {
            _logger.info(`Password verify failed due reason: ${(e as { message: string }).message}`);
            throw e;
        }
    }
    public static async hashPassword(password: string, salt: Buffer): Promise<string | undefined> {
        const response = await argon2.hash(password, {
            type: argon2.argon2d,
            memoryCost: 2 ** 16,
            hashLength: 50,
            salt,
        });
        return response;
    }

    public static convertServerUserToClientUser(user: IUser, tokenLong: string, token: string): IUserClient {
        return {
            userId: user.userId,
            email: user.email,
            status: user.status,
            token,
            tokenLong,
        };
    }

    public static formatUserDetails(draftUser: IUserServer): IUser {
        return {
            userId: draftUser.userId,
            email: draftUser.email,
            status: draftUser.status,
        };
    }
}
