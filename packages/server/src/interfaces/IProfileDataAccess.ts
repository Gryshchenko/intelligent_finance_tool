import { IProfile } from 'interfaces/IProfile';
import { ICreateProfile } from 'interfaces/ICreateProfile';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { IProfilePatchRequest } from 'tenpercent/shared';

export interface IProfileDataAccess {
    post(data: ICreateProfile, trx?: IDBTransaction): Promise<IProfile | undefined>;
    get(userId: number, trx?: IDBTransaction): Promise<IProfile | undefined>;
    patch(userId: number, properties: Partial<IProfilePatchRequest>, trx?: IDBTransaction): Promise<boolean | undefined>;
}
