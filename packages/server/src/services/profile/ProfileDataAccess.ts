import { IProfileDataAccess } from 'interfaces/IProfileDataAccess';
import { IDatabaseConnection, IDBTransaction } from 'interfaces/IDatabaseConnection';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { IProfile } from 'interfaces/IProfile';
import { ICreateProfile } from 'interfaces/ICreateProfile';
import { IProfilePatchRequest } from 'tenpercent/shared/src/interfaces/IProfilePatchRequest';
import { DBError } from 'src/utils/errors/DBError';
import { validateAllowedProperties } from 'src/utils/validation/validateAllowedProperties';
import { getOnlyNotEmptyProperties } from 'src/utils/validation/getOnlyNotEmptyProperties';

export default class ProfileDataService extends LoggerBase implements IProfileDataAccess {
    private readonly _db: IDatabaseConnection;

    public constructor(db: IDatabaseConnection) {
        super();
        this._db = db;
    }
    async post(data: ICreateProfile, trx?: IDBTransaction): Promise<IProfile> {
        try {
            this._logger.info('Request to create profile');
            const { userId, locale, currencyId, publicName } = data;
            const query = trx || this._db.engine();
            const response = await query('profiles').insert({ userId, locale, currencyId, publicName }, ['*']);

            if (!response?.[0]) {
                throw new Error('Failed to create profile');
            }

            this._logger.info('Profile created successfully');
            return response[0];
        } catch (e) {
            this._logger.error(`Profile creation error: ${(e as { message: string }).message}`);
            throw new DBError({ message: `Profile creation error: ${(e as { message: string }).message}` });
        }
    }

    async get(userId: number, trx?: IDBTransaction): Promise<IProfile | undefined> {
        try {
            this._logger.info('Request to retrieve profile');
            const query = trx || this._db.engine();
            const data = query<IProfile>('profiles')
                .select<IProfile>(
                    'profiles.profileId',
                    'profiles.userId',
                    'profiles.publicName',
                    'profiles.currencyId',
                    'profiles.additionalInfo',
                    'profiles.locale',
                    'email_confirmations.confirmed as mailConfirmed',
                )
                .innerJoin('email_confirmations', 'profiles.userId', 'email_confirmations.userId')
                .where({ 'profiles.userId': userId })
                .first();

            this._logger.info('Profile retrieval successful');
            return data || undefined;
        } catch (e) {
            this._logger.error(`Profile retrieval error: ${(e as { message: string }).message}`);
            throw new DBError({ message: `Profile retrieval error: ${(e as { message: string }).message}` });
        }
    }

    async patch(userId: number, properties: Partial<IProfilePatchRequest>, trx?: IDBTransaction): Promise<boolean> {
        try {
            this._logger.info('Request to confirm user email');

            const allowedKeys = ['locale', 'currencyId', 'publicName'] as string[];

            validateAllowedProperties(properties, allowedKeys);

            const properestForUpdate = getOnlyNotEmptyProperties(properties, allowedKeys);

            properestForUpdate.updatedAt = new Date().toISOString();
            const query = trx || this._db.engine();
            await query<IProfile>('profiles').where({ userId }).update(properestForUpdate).first();

            this._logger.info(`Profile retrieved successfully`, properestForUpdate);
            return true;
        } catch (e) {
            this._logger.error(`Email confirmation error: ${(e as { message: string }).message}`);
            throw new DBError({ message: `Email confirmation error: ${(e as { message: string }).message}` });
        }
    }
}
