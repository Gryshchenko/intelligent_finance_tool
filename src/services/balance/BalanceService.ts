import { IBalanceDataAccess } from 'interfaces/IBalanceDataAccess';
import { IBalanceService } from 'interfaces/IBalanceService';
import { LoggerBase } from 'helper/logger/LoggerBase';
import { IBalance } from 'interfaces/IBalance';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { ICurrencyService } from 'interfaces/ICurrencyService';
import { IProfileService } from 'interfaces/IProfileService';
import Utils from 'src/utils/Utils';
import { IRate } from 'interfaces/IRate';
import { CustomError } from 'src/utils/errors/CustomError';
import { HttpCode } from 'types/HttpCode';
import { ErrorCode } from 'types/ErrorCode';

export default class BalanceService extends LoggerBase implements IBalanceService {
    private readonly _balanceDataAccess: IBalanceDataAccess;
    private readonly _currencyService: ICurrencyService;
    private readonly _profileService: IProfileService;

    public constructor(
        balanceDataAccess: IBalanceDataAccess,
        currencyService: ICurrencyService,
        profileService: IProfileService,
    ) {
        super();
        this._balanceDataAccess = balanceDataAccess;
        this._currencyService = currencyService;
        this._profileService = profileService;
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
    async patch(userId: number, properties: { amount: number; currencyCode: string }, trx?: IDBTransaction): Promise<number> {
        try {
            this._logger.info(`Patch user balance to amount: ${properties.amount} currency: ${properties.currencyCode}`);
            const profile = await this._profileService.getProfile(userId);
            if (Utils.isNull(profile?.currencyCode)) {
                throw this.error(`Patch user balance failed, profile currency null`);
            }
            if (profile?.currencyCode && profile.currencyCode === properties.currencyCode) {
                this._logger.info(`Patch user balance success`);
                return await this._balanceDataAccess.patch(userId, properties, trx);
            }
            const currency = profile?.currencyCode as unknown as string;
            const response = await this._currencyService.getRate(currency, properties.currencyCode);
            if (Utils.isNull(response) || Utils.isObjectEmpty(response as unknown as Record<string, unknown>)) {
                throw this.error(`Fetch rate for default currency ${currency} and target currency: ${properties.currencyCode}`);
            }
            const { rate } = response as unknown as IRate;
            const { amount } = properties;
            this._logger.info(`Patch user balance success`);
            return await this._balanceDataAccess.patch(
                userId,
                {
                    amount: Utils.roundNumber(amount * rate),
                },
                trx,
            );
        } catch (e) {
            this._logger.error(`Patch balance failed due reason: ${(e as { message: string }).message}`);
            throw e;
        }
    }
}
