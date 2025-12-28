import { NextFunction, Request, Response } from 'express';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import Logger from 'helper/logger/Logger';
import { Time } from 'tenpercent/shared/src/utils/time/Time';
import { ValidationError } from 'src/utils/errors/ValidationError';
import { BaseError } from 'src/utils/errors/BaseError';
import { DateTime } from 'luxon';

const validateTransactionFromToDateQuery = (schema: Record<string, string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            let from: DateTime | null = null;
            let to: DateTime | null = null;
            const now = Time.utc();

            if (schema['from']) {
                from = Time.fromISO(String(req.query?.from), true);
                if (from?.toSeconds() > now?.toSeconds()) {
                    throw new ValidationError({
                        message: '"from" should not be greater than current time',
                        payload: { reason: null, field: 'from' },
                    });
                }
            }

            if (schema['to']) {
                to = Time.fromISO(String(req.query?.to), true);
                if (to?.toSeconds() > now?.toSeconds()) {
                    throw new ValidationError({
                        message: '"to" should not be greater than current time',
                        payload: { reason: null, field: 'to' },
                    });
                }
            }

            if (from && to && from?.toSeconds() > to?.toSeconds()) {
                throw new ValidationError({
                    message: '"from" should not be greater than "to"',
                });
            }
        } catch (e) {
            const error = e as BaseError;
            Logger.Of('validateQuery').error(`Validate query failed due reason`, JSON.stringify(error.message));
            return res.status(HttpCode.BAD_REQUEST).json(
                new ResponseBuilder()
                    .setStatus(ResponseStatusType.INTERNAL)
                    .setError({
                        errorCode: ErrorCode.UNEXPECTED_PROPERTY,
                        msg: error.message,
                        payload: error?.getPayload(),
                    })
                    .build(),
            );
        }
        next();
    };
};

export { validateTransactionFromToDateQuery };
