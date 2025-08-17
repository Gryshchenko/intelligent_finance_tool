import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

export interface IUserServer {
    email: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    status: UserStatus;
}
