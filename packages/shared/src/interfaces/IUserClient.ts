import { UserStatus } from 'interfaces/UserStatus';

export interface IUserClient {
    userId: number;
    email: string;
    status: UserStatus;
    token: string;
    tokenLong: string;
}
