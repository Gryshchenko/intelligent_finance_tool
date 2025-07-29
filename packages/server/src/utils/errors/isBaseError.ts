import { BaseError } from 'src/utils/errors/BaseError';

export function isBaseError(err: unknown): err is BaseError {
    return typeof err === 'object' && err !== null && typeof (err as BaseError).getStatusCode === 'function';
}
