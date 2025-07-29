import { NextFunction, Request, Response } from 'express';
import { HttpCode } from 'types/HttpCode';
import ResponseBuilder from 'helper/responseBuilder/ResponseBuilder';
import { ResponseStatusType } from 'types/ResponseStatusType';
import { ErrorCode } from 'types/ErrorCode';

const validateQuery = (schema: Record<string, string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors: string[] = [];
        Object.keys(req.query).forEach((key) => {
            if (!schema[key]) {
                errors.push(`Unexpected query parameter: ${key}`);
            }
        });

        Object.keys(schema).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(schema, key)) {
                return;
            }
            const expectedType = schema[key].replace('?', '');
            const isOptional = schema[key].includes('?');
            const value = req.query[key];

            if (value === undefined && !isOptional) {
                errors.push(`Missing query parameter: ${key}`);
                return;
            }
            if (expectedType === 'number') {
                const numValue = Number(value);
                if (isNaN(numValue) || numValue < Number.MIN_SAFE_INTEGER || numValue > Number.MAX_SAFE_INTEGER) {
                    errors.push(`Invalid type for ${key}: expected number in range`);
                }
            }

            if (expectedType === 'string' && typeof value !== 'string' && String(value).length <= 200) {
                errors.push(`Invalid type for ${key}: expected string`);
            }
        });

        if (errors.length) {
            return res.status(HttpCode.BAD_REQUEST).json(
                new ResponseBuilder()
                    .setStatus(ResponseStatusType.INTERNAL)
                    .setErrors(
                        errors.map((str) => ({
                            errorCode: ErrorCode.UNEXPECTED_PROPERTY,
                            message: str,
                        })),
                    )
                    .build(),
            );
        }

        next();
    };
};

export { validateQuery };
