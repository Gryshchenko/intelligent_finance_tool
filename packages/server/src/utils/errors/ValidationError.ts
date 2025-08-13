import { IError } from 'interfaces/IError';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
    constructor({ message, statusCode = HttpCode.BAD_REQUEST, errorCode, payload }: IError) {
        super({ message, statusCode, errorCode, payload });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
