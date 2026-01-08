import { BaseError } from './BaseError';
import { IError } from 'tenpercent/shared';

export class CustomError extends BaseError {
    constructor({ message, statusCode, errorCode, payload }: IError) {
        super({ message, statusCode, errorCode, payload });
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
