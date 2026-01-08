import { IUserServer } from 'interfaces/IUserServer';
import { ICreateUserServer } from 'interfaces/ICreateUserServer';
import { IGetUserAuthenticationData } from 'interfaces/IGetUserAuthenticationData';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { UserStatus } from '../../../shared/src/types/UserStatus';

export interface IUserDataAccess {
    getUserAuthenticationData(email: string): Promise<IGetUserAuthenticationData | undefined>;
    get(userId: number): Promise<IUserServer>;
    create(email: string, password: string, salt: string, trx?: IDBTransaction): Promise<ICreateUserServer>;
    patch(userId: number, properties: Partial<{ email: string; status: UserStatus }>, trx?: IDBTransaction): Promise<void>;
    getUserEmail(userId: number): Promise<{ email: string } | undefined>;
}
