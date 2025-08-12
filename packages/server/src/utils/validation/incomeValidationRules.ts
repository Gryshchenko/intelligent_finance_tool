import { createSignupValidationRules } from 'src/utils/validation/routesInputValidation';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';

const incomeConvertValidationMessageToErrorCode = (path: string): ErrorCode => {
    switch (path) {
        case 'status': {
            return ErrorCode.INCOME_STATUS_ERROR;
        }
        case 'currencyId': {
            return ErrorCode.CURRENCY_ID_ERROR;
        }
        case 'incomeName': {
            return ErrorCode.INCOME_NAME;
        }
        default: {
            return ErrorCode.INCOME_ERROR;
        }
    }
};
const createIncomeValidationRules = [
    ...createSignupValidationRules('incomeName', 'string', {
        min: 3,
        max: 128,
    }),
    ...createSignupValidationRules('currencyId', 'number', {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
    }),
];

const patchIncomeValidationRules = [
    ...createSignupValidationRules('incomeName', 'string', {
        optional: true,
        min: 3,
        max: 128,
    }),
    ...createSignupValidationRules('status', 'number', {
        optional: true,
        min: 2,
        max: 3,
    }),
];

export { patchIncomeValidationRules, incomeConvertValidationMessageToErrorCode, createIncomeValidationRules };
