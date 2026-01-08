import { IUser } from 'interfaces/IUser';
import { ICreateUser } from 'interfaces/ICreateUser';
import { IGetUserAuthenticationData } from 'interfaces/IGetUserAuthenticationData';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { UserStatus } from '../../../shared/src/types/UserStatus';

export interface IUserService {
    getUserAuthenticationData(email: string): Promise<IGetUserAuthenticationData | undefined>;
    get(userId: number): Promise<IUser>;
    create(email: string, password: string, trx?: IDBTransaction): Promise<ICreateUser>;
    patch(userId: number, properties: Partial<{ email: string; status: UserStatus }>, trx?: IDBTransaction): Promise<void>;
}
