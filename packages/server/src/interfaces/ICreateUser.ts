import { IUserStatus } from 'tenpercent/shared/src/interfaces/IUserStatus';

export interface ICreateUser {
    userId: number;
    email: string;
    status: IUserStatus;
    createdAt: string;
    updatedAt: string;
}
