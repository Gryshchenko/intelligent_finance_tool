import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';

export interface IError {
    message: string;
    errorCode?: ErrorCode;
    statusCode?: HttpCode;
}
