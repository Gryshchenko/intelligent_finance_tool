import 'express-session';
import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';


declare global {
    namespace Express {
        interface User {
            userId: number;
            email: string;
            status: UserStatus;
        }
    }
}
