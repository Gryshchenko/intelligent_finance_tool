import { IEmailConfirmationDataAccess } from 'interfaces/IEmailConfirmationDataAccess';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { IEmailConfirmationData } from 'interfaces/IEmailConfirmationData';
import Utils from 'src/utils/Utils';
import { DBError } from 'src/utils/errors/DBError';
import { ValidationError } from 'src/utils/errors/ValidationError';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { isBaseError } from 'src/utils/errors/isBaseError';
import { BaseError } from 'src/utils/errors/BaseError';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';

export default class EmailConfirmationDataAccess extends LoggerBase implements IEmailConfirmationDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }

    public async deleteUserConfirmation(userId: number, email: string): Promise<boolean> {
        this._logger.info(`Attempting to delete confirmation with email ${email} for userId ${userId}`);

        try {
            const result = await this._db
                .engine()<IEmailConfirmationData>('email_confirmations')
                .where({ userId, email })
                .delete();

            const isDeleted = Utils.greaterThen0(result);
            if (!isDeleted) {
                this._logger.error(`No confirmation found with email ${email} for userId ${userId}`);
                throw new ValidationError({
                    message: `No confirmation found with email ${email} for userId ${userId}`,
                    statusCode: HttpCode.NOT_FOUND,
                });
            }
            this._logger.info(`Successfully deleted confirmation with email ${email} for userId ${userId}`);

            return isDeleted;
        } catch (e) {
            this._logger.error(`Error deleting confirmation for userId ${userId}: ${(e as { message: string }).message}`);
            throw new DBError({
                message: `Error deleting confirmation for userId ${userId}: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    public async getUserConfirmation(userId: number, email: string): Promise<IEmailConfirmationData | undefined> {
        this._logger.info(`Fetching confirmation for userId ${userId} with email ${email}`);

        try {
            const data = await this._db
                .engine()<IEmailConfirmationData>('email_confirmations')
                .where({ userId, email })
                .select('*')
                .first();

            if (data) {
                this._logger.info(`Successfully fetched confirmation for userId ${userId} with email ${email}`);
            } else {
                this._logger.error(`No confirmation found for userId ${userId} with email ${email}`);
                throw new ValidationError({
                    message: `No confirmation found for userId ${userId} with email ${email}`,
                    errorCode: ErrorCode.EMAIL_VERIFICATION_CODE_INVALID,
                    statusCode: HttpCode.NOT_FOUND,
                });
            }

            return data as IEmailConfirmationData;
        } catch (e) {
            this._logger.error(
                `Error fetching confirmation for userId ${userId} with email ${email}: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Error fetching confirmation for userId ${userId} with email ${email}: ${(e as { message: string }).message}`,
                statusCode: isBaseError(e) ? (e as unknown as BaseError)?.getStatusCode() : undefined,
            });
        }
    }

    public async createUserConfirmation(
        payload: {
            userId: number;
            confirmationCode: number;
            email: string;
            expiresAt: Date;
        },
        trx?: IDBTransaction,
    ): Promise<IEmailConfirmationData> {
        const { userId, confirmationCode, email, expiresAt } = payload;
        this._logger.info(`Creating confirmation for userId ${userId} with email ${email} and code ${confirmationCode}`);

        try {
            const query = trx || this._db.engine();
            const data = await query<IEmailConfirmationData>('email_confirmations').insert(
                { email, userId, confirmationCode, expiresAt },
                ['*'],
            );

            this._logger.info(`Successfully created confirmation for userId ${userId} with email ${email}`);
            return data[0];
        } catch (e) {
            this._logger.error(
                `Error creating confirmation for userId ${userId} with email ${email}: ${(e as { message: string }).message}`,
            );
            throw new DBError({
                message: `Error creating confirmation for userId ${userId} with email ${email}: ${(e as { message: string }).message}`,
            });
        }
    }
}
