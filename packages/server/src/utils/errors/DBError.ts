import { IError } from 'tenpercent/shared';
import { BaseError } from './BaseError';
import { HttpCode } from 'tenpercent/shared';
import { ErrorCode } from 'tenpercent/shared';

export class DBError extends BaseError {
    constructor({
        message,
        statusCode = HttpCode.INTERNAL_SERVER_ERROR,
        errorCode = ErrorCode.CANT_STORE_DATA,
        payload,
    }: IError) {
        super({ message, statusCode, errorCode, payload });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
