import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';
import { IUserAgentInfo } from 'interfaces/IUserAgentInfo';

export interface IUserSession {
    userId: number;
    sessionId: string;
    status: UserStatus;
    ip: string | undefined;
    token: string;
    email: string;
    userAgent: IUserAgentInfo | undefined;
}
