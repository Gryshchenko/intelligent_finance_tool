import { createSignupValidationRules } from 'src/utils/validation/routesInputValidation';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';

const categoryConvertValidationMessageToErrorCode = (path: string): ErrorCode => {
    switch (path) {
        case 'status': {
            return ErrorCode.INCOME_ERROR;
        }
        case 'currencyId': {
            return ErrorCode.CURRENCY_ERROR;
        }
        case 'categoryName': {
            return ErrorCode.CATEGORY_ERROR;
        }
        default: {
            return ErrorCode.CATEGORY_ERROR;
        }
    }
};
const createCategoryValidationRules = [
    ...createSignupValidationRules('categoryName', 'string', {
        min: 3,
        max: 128,
    }),
    ...createSignupValidationRules('currencyId', 'number', {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
    }),
];

const patchCategoryValidationRules = [
    ...createSignupValidationRules('categoryName', 'string', {
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

export { patchCategoryValidationRules, categoryConvertValidationMessageToErrorCode, createCategoryValidationRules };
