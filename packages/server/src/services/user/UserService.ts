import { IUserDataAccess } from 'interfaces/IUserDataAccess';
import { IUser } from 'interfaces/IUser';
import { IUserService } from 'interfaces/IUserService';
import UserServiceUtils from 'src/services/user/UserServiceUtils';
import { ICreateUser } from 'interfaces/ICreateUser';
import { IGetUserAuthenticationData } from 'interfaces/IGetUserAuthenticationData';
import { LoggerBase } from 'src/helper/logger/LoggerBase';
import { IDBTransaction } from 'interfaces/IDatabaseConnection';
import { UserStatus } from 'tenpercent/shared';

export default class UserService extends LoggerBase implements IUserService {
    private readonly _userDataAccess: IUserDataAccess;

    public constructor(userDataAccess: IUserDataAccess) {
        super();
        this._userDataAccess = userDataAccess;
    }

    public async getUserAuthenticationData(email: string): Promise<IGetUserAuthenticationData | undefined> {
        return await this._userDataAccess.getUserAuthenticationData(email);
    }

    public async get(userId: number): Promise<IUser> {
        return UserServiceUtils.formatUserDetails(await this._userDataAccess.get(userId));
    }

    public async create(email: string, password: string, trx?: IDBTransaction): Promise<ICreateUser> {
        const salt = UserServiceUtils.getRandomSalt();
        const hashStr = await UserServiceUtils.hashPassword(password, salt);
        const hash = hashStr as unknown as string;

        return await this._userDataAccess.create(email, hash, salt.toString('hex'), trx);
    }
    public async patch(
        userId: number,
        properties: Partial<{
            email: string;
            status: UserStatus;
        }>,
        trx?: IDBTransaction,
    ): Promise<void> {
        return await this._userDataAccess.patch(userId, properties, trx);
    }
}
