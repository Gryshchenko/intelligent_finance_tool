import { IBalanceDataAccess } from 'interfaces/IBalanceDataAccess';
import { IBalanceService } from 'interfaces/IBalanceService';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { IBalance } from 'interfaces/IBalance';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { IProfileService } from 'interfaces/IProfileService';
import Utils from 'src/utils/Utils';
import { IRate } from 'interfaces/IRate';
import { CustomError } from 'src/utils/errors/CustomError';
import { HttpCode } from 'types/HttpCode';
import { ErrorCode } from 'types/ErrorCode';
import { IExchangeRateService } from 'interfaces/IExchangeRateService';

export default class BalanceService extends LoggerBase implements IBalanceService {
    private readonly _balanceDataAccess: IBalanceDataAccess;
    private readonly _profileService: IProfileService;
    private readonly _exchangeRateService: IExchangeRateService;

    public constructor(
        balanceDataAccess: IBalanceDataAccess,
        profileService: IProfileService,
        exchangeRateService: IExchangeRateService,
    ) {
        super();
        this._balanceDataAccess = balanceDataAccess;
        this._profileService = profileService;
        this._exchangeRateService = exchangeRateService;
    }
    async get(userId: number): Promise<IBalance> {
        return await this._balanceDataAccess.get(userId);
    }
    private error(msg: string): CustomError {
        this._logger.error(msg);
        return new CustomError({
            message: msg,
            statusCode: HttpCode.INTERNAL_SERVER_ERROR,
            errorCode: ErrorCode.PROFILE_ERROR,
        });
    }
    async post(userId: number, properties: { amount: number; currencyCode: string }, trx?: IDBTransaction): Promise<number> {
        return await this._balanceDataAccess.post(userId, properties, trx);
    }

    async patch(userId: number, properties: { amount: number; currencyCode: string }, trx?: IDBTransaction): Promise<number> {
        try {
            this._logger.info(`Patch user balance to amount: ${properties.amount} currency: ${properties.currencyCode}`);
            const profile = await this._profileService.getProfile(userId, trx);
            if (Utils.isNull(profile?.currencyCode)) {
                throw this.error(`Patch user balance failed, profile currency null`);
            }
            if (profile?.currencyCode && profile.currencyCode === properties.currencyCode) {
                const result = await this._balanceDataAccess.patch(userId, properties, trx);
                this._logger.info(`Patch user balance success`);
                return result;
            }
            const currency = profile?.currencyCode as unknown as string;
            const response = await this._exchangeRateService.get(currency, properties.currencyCode);
            if (Utils.isNull(response) || Utils.isObjectEmpty(response as unknown as Record<string, unknown>)) {
                throw this.error(`Fetch rate for default currency ${currency} and target currency: ${properties.currencyCode}`);
            }
            const { rate } = response as unknown as IRate;
            const { amount } = properties;
            const result = await this._balanceDataAccess.patch(
                userId,
                {
                    amount: Utils.roundNumber(amount * rate),
                },
                trx,
            );
            this._logger.info(`Patch user balance success amount: ${Utils.roundNumber(amount * rate)}`);
            return result;
        } catch (e) {
            this._logger.error(`Patch balance failed due reason: ${(e as { message: string }).message}`);
            throw e;
        }
    }
}
