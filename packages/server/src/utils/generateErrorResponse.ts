import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { Response } from 'express';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import { BaseError } from './errors/BaseError';

export function generateErrorResponse(
    res: Response,
    responseBuilder: ResponseBuilder,
    error: BaseError,
    defaultErrorCode: ErrorCode,
) {
    const statusCode =
        error instanceof BaseError ? (error?.getStatusCode() ?? HttpCode.INTERNAL_SERVER_ERROR) : HttpCode.INTERNAL_SERVER_ERROR;
    const errorCode = error instanceof BaseError ? (error.getErrorCode() ?? defaultErrorCode) : defaultErrorCode;
    return res.status(statusCode).json(responseBuilder.setStatus(ResponseStatusType.INTERNAL).setError({ errorCode }).build());
}
