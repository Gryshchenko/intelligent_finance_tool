import { IError } from 'tenpercent/shared/src/interfaces/IError';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
    constructor({ message, statusCode = HttpCode.NOT_FOUND, errorCode = ErrorCode.CANT_STORE_DATA, payload }: IError) {
        super({ message, statusCode, errorCode, payload });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
