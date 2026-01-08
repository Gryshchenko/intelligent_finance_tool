import { UserStatus } from '../../../shared/src/types/UserStatus';

export interface IUserServer {
    email: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    status: UserStatus;
}
