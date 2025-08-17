import { IEmailConfirmationDataAccess } from 'interfaces/IEmailConfirmationDataAccess';
import { IEmailConfirmationService } from 'interfaces/IEmailConfirmationService';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { IMailService } from 'interfaces/IMailService';
import { IMailTemplateService } from 'interfaces/IMailTemplateService';
import { TranslationKey } from 'types/TranslationKey';
import { IUserService } from 'interfaces/IUserService';
import { IEmailConfirmationData } from 'interfaces/IEmailConfirmationData';
import Translations from 'src/services/translations/Translations';
import TimeManagerUTC from 'src/utils/TimeManagerUTC';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { getConfig } from 'src/config/config';
import { CustomError } from 'src/utils/errors/CustomError';
import { ValidationError } from 'src/utils/errors/ValidationError';

import { randomBytes } from 'crypto';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import Utils from 'src/utils/Utils';

const CONFIRMATION_MAIL_EXPIRED_TIME = [0, 15, 0];

export default class EmailConfirmationService extends LoggerBase implements IEmailConfirmationService {
    protected emailConfirmationDataAccess: IEmailConfirmationDataAccess;

    protected mailService: IMailService;

    protected mailTemplateService: IMailTemplateService;

    protected userService: IUserService;

    public constructor(
        emailConfirmationDataAccess: IEmailConfirmationDataAccess,
        emailService: IMailService,
        mailTemplateService: IMailTemplateService,
        userService: IUserService,
    ) {
        super();
        this.emailConfirmationDataAccess = emailConfirmationDataAccess;
        this.mailService = emailService;
        this.mailTemplateService = mailTemplateService;
        this.userService = userService;
    }

    private createConfirmationKey(): number {
        const buffer = randomBytes(4);
        const number = buffer.readUInt32BE(0);
        return Number(number.toString().padStart(8, '0').substring(0, 8));
    }

    private async sendMail(email: string, confirmationCode: number): Promise<unknown> {
        try {
            const response = await this.mailService.sendMail({
                subject: Translations.text(TranslationKey.CONFIRM_MAIL_ADDRESS),
                sender: { mail: String(getConfig().mailNotReply), name: String(getConfig().appName) },
                recipients: [{ mail: email, name: Translations.text(TranslationKey.HELLO_GUEST) }],
                tags: {
                    code: confirmationCode,
                    company: String(getConfig().appName),
                    CONFIRM_MAIL_ADDRESS: Translations.text(TranslationKey.CONFIRM_MAIL_ADDRESS),
                    HELLO_GUEST: Translations.text(TranslationKey.HELLO_GUEST),
                    CONFIRM_MAIL_TEXT: Translations.text(TranslationKey.CONFIRM_MAIL_TEXT),
                    CONFIRM_MAIL_TEXT2: Translations.text(TranslationKey.CONFIRM_MAIL_TEXT2),
                    SINCERELY: Translations.text(TranslationKey.SINCERELY),
                },
                text: Translations.text(TranslationKey.CONFIRM_MAIL_TEXT),
                template: this.mailTemplateService.getConfirmMailTemplate(),
            });
            return response;
        } catch (e) {
            throw new CustomError({
                message: `Cant send mail by provider reason : ${JSON.stringify(e)}`,
                errorCode: ErrorCode.EMAIL_CANNOT_SEND_ERROR,
            });
        }
    }

    public async createConfirmationMail(userId: number, email: string, trx?: IDBTransaction): Promise<IEmailConfirmationData> {
        try {
            const confirmationCode: number = this.createConfirmationKey();
            const userConfirmationData = await this.emailConfirmationDataAccess.getUserConfirmation(userId, email);
            // const userConfirmationDataInWork = userConfirmationData as IEmailConfirmationData;
            // this.isConfirmationCodeAlreadySend(userConfirmationDataInWork);
            // this.checkIsMailConfirmed(userConfirmationDataInWork);
            const timeManager = new TimeManagerUTC();
            timeManager.addTime(...CONFIRMATION_MAIL_EXPIRED_TIME);
            const expiresAt = timeManager.getCurrentTime();
            return await this.emailConfirmationDataAccess.createUserConfirmation(
                {
                    userId,
                    email,
                    confirmationCode,
                    expiresAt,
                },
                trx,
            );
        } catch (e) {
            this._logger.error(`Send confirmation mail to user failed due reason: ${(e as { message: string }).message}`);
            throw e;
        }
    }

    public async sendConfirmationMail(userId: number, email: string): Promise<IEmailConfirmationData> {
        const userConfirmationData = await this.emailConfirmationDataAccess.getUserConfirmation(userId, email);
        const userConfirmationDataInWork = userConfirmationData as IEmailConfirmationData;
        this.checkIsMailConfirmed(userConfirmationDataInWork);
        await this.sendMail(userConfirmationDataInWork.email, userConfirmationDataInWork.confirmationCode);
        return userConfirmationDataInWork;
    }

    public async reSendConfirmationMail(userId: number, email: string): Promise<void> {
        const userConfirmationData = await this.emailConfirmationDataAccess.getUserConfirmation(userId, email);
        const userConfirmationDataInWork = userConfirmationData as IEmailConfirmationData;
        this.isConfirmationCodeAlreadySend(userConfirmationDataInWork);
        this.checkIsMailConfirmed(userConfirmationDataInWork);
        const timeManager = new TimeManagerUTC();
        timeManager.addTime(...CONFIRMATION_MAIL_EXPIRED_TIME);
        const newTime = timeManager.getCurrentTime();
        const confirmationCode: number = this.createConfirmationKey();
        await this.emailConfirmationDataAccess.patchUserConfirmation(userId, email, {
            confirmationCode,
            expiresAt: newTime,
        });
        await this.sendMail(userConfirmationDataInWork.email, confirmationCode);
    }

    public async confirmUserMail(userId: number, email: string, confirmationCode: number, trx?: IDBTransaction): Promise<void> {
        const userConfirmationData = await this.emailConfirmationDataAccess.getUserConfirmation(userId, email);
        if (Utils.isObjectEmpty(userConfirmationData as unknown as Record<string, unknown>)) {
            throw new ValidationError({
                message: `No confirmation found for userId ${userId} with email ${email}`,
                errorCode: ErrorCode.EMAIL_VERIFICATION_CODE_INVALID_ERROR,
                statusCode: HttpCode.NOT_FOUND,
            });
        }
        const userConfirmationDataInWork = userConfirmationData as IEmailConfirmationData;
        const timeManager = new TimeManagerUTC();
        if (userConfirmationDataInWork.confirmed) {
            throw new ValidationError({
                message: `Confirmation code already confirmed for ${userId} with email ${email}`,
                errorCode: ErrorCode.EMAIL_VERIFICATION_ALREADY_DONE_ERROR,
                statusCode: HttpCode.BAD_REQUEST,
            });
        }
        if (timeManager.isFirstDateLessThanSecond(userConfirmationDataInWork?.expiresAt, timeManager.getCurrentTime())) {
            throw new ValidationError({
                message: `Confirmation code expired for ${userId} with email ${email}`,
                errorCode: ErrorCode.EMAIL_VERIFICATION_CODE_EXPIRED_ERROR,
                statusCode: HttpCode.BAD_REQUEST,
            });
        }
        if (userConfirmationDataInWork.confirmationCode !== confirmationCode) {
            throw new ValidationError({
                message: `Confirmation code not same for ${userId} with email ${email}`,
                errorCode: ErrorCode.EMAIL_VERIFICATION_CODE_INVALID_ERROR,
                statusCode: HttpCode.BAD_REQUEST,
            });
        }
        await this.emailConfirmationDataAccess.patchUserConfirmation(userId, email, { confirmed: true, confirmationCode }, trx);
    }

    public async deleteUserConfirmation(userId: number, email: string): Promise<boolean> {
        return await this.emailConfirmationDataAccess.deleteUserConfirmation(userId, email);
    }

    public async getUserConfirmation(userId: number, email: string): Promise<IEmailConfirmationData | undefined> {
        return await this.emailConfirmationDataAccess.getUserConfirmation(userId, email);
    }

    private checkIsMailConfirmed(userConfirmationData: IEmailConfirmationData): void {
        if (userConfirmationData?.confirmed) {
            throw new ValidationError({
                message: 'Send confirmation failed due mail already confirmed',
                errorCode: ErrorCode.EMAIL_VERIFICATION_ALREADY_DONE_ERROR,
            });
        }
    }
    private isConfirmationCodeAlreadySend(payload: IEmailConfirmationData): void {
        const timeManager = new TimeManagerUTC();
        if (!timeManager.isFirstDateLessThanSecond(payload?.expiresAt, timeManager.getCurrentTime())) {
            throw new ValidationError({
                message: 'Sending confirmation mail failed, mail already send',
                errorCode: ErrorCode.EMAIL_VERIFICATION_ALREADY_SENT_ERROR,
                payload: {
                    nextAt: payload.expiresAt,
                },
            });
        }
    }
}
