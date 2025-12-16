import { NextFunction, Request, Response } from 'express';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import Logger from 'helper/logger/Logger';
import { Time } from 'tenpercent/shared/src/utils/time/Time';

const validateTransactionFromToDateQuery = (schema: Record<string, string>) => {
    return (_: Request, res: Response, next: NextFunction) => {
        try {
            let from: Time | null = null;
            let to: Time | null = null;
            const now = Time.utc();

            if (schema['from']) {
                from = Time.fromISO(schema['from'], true);
                if (from > now) {
                    throw new Error('"from" should not be greater than current time');
                }
            }

            if (schema['to']) {
                to = Time.fromISO(schema['to'], true);
                if (to > now) {
                    throw new Error('"to" should not be greater than current time');
                }
            }

            if (from && to && from > to) {
                throw new Error('"from" should not be greater than "to"');
            }
        } catch (e) {
            Logger.Of('validateQuery').error(`Validate query failed due reason`, e);
            return res.status(HttpCode.BAD_REQUEST).json(
                new ResponseBuilder()
                    .setStatus(ResponseStatusType.INTERNAL)
                    .setError({
                        errorCode: ErrorCode.UNEXPECTED_PROPERTY,
                        msg: '',
                    })
                    .build(),
            );
        }
        next();
    };
};

export { validateTransactionFromToDateQuery };
