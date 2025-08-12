import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';

export interface IResponseError {
    errorCode: ErrorCode | undefined;
    msg?: string;
}
