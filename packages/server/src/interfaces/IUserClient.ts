import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

export interface IUserClient {
    userId: number;
    email: string;
    status: UserStatus;
}
