import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

export interface IUser {
    userId: number;
    email: string;
    status: UserStatus;
}
