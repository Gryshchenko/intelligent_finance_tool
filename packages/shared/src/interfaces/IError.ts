import { ErrorCode } from 'types/ErrorCode';
import { HttpCode } from 'types/HttpCode';

export interface IError {
    message: string;
    errorCode?: ErrorCode;
    statusCode?: HttpCode;
    payload?: {
        field: string;
        reason?: 'not_found' | unknown;
    };
}
