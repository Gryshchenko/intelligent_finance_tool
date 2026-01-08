import { IProfileDataAccess } from 'interfaces/IProfileDataAccess';
import { IProfileService } from 'interfaces/IProfileService';
import { IProfile } from 'interfaces/IProfile';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { ICreateProfile } from 'interfaces/ICreateProfile';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { IProfilePatchRequest } from 'tenpercent/shared';

export default class ProfileService extends LoggerBase implements IProfileService {
    private readonly _profileDataAccess: IProfileDataAccess;

    public constructor(profileDataAccess: IProfileDataAccess) {
        super();
        this._profileDataAccess = profileDataAccess;
    }

    public async post(data: ICreateProfile, trx?: IDBTransaction): Promise<IProfile | undefined> {
        return await this._profileDataAccess.post(data, trx);
    }

    public async get(userId: number, trx?: IDBTransaction): Promise<IProfile | undefined> {
        return await this._profileDataAccess.get(userId, trx);
    }

    public async patch(
        userId: number,
        properties: Partial<IProfilePatchRequest>,
        trx?: IDBTransaction,
    ): Promise<boolean | undefined> {
        return await this._profileDataAccess.patch(userId, properties, trx);
    }
}
