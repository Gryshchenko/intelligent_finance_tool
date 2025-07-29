import { createSignupValidationRules } from 'src/utils/validation/routesInputValidation';
import { ErrorCode } from 'types/ErrorCode';

const accountConvertValidationMessageToErrorCode = (path: string): ErrorCode => {
    switch (path) {
        case 'status': {
            return ErrorCode.ACCOUNT_STATUS_ERROR;
        }
        case 'currencyId': {
            return ErrorCode.CURRENCY_ID_ERROR;
        }
        case 'accountName': {
            return ErrorCode.ACCOUNT_NAME;
        }
        case 'amount': {
            return ErrorCode.AMOUNT_ERROR;
        }
        default: {
            return ErrorCode.ACCOUNT_ERROR;
        }
    }
};
const createAccountValidationRules = [
    ...createSignupValidationRules('accountName', 'string', {
        min: 3,
        max: 128,
    }),
    ...createSignupValidationRules('amount', 'number', {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
    }),
    ...createSignupValidationRules('currencyId', 'number', {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
    }),
];

const patchAccountValidationRules = [
    ...createSignupValidationRules('accountName', 'string', {
        optional: true,
        min: 3,
        max: 128,
    }),
    ...createSignupValidationRules('amount', 'number', {
        optional: true,
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
    }),
    ...createSignupValidationRules('status', 'number', {
        optional: true,
        min: 2,
        max: 3,
    }),
];

export { patchAccountValidationRules, accountConvertValidationMessageToErrorCode, createAccountValidationRules };
