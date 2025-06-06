import { createSignupValidationRules } from 'src/utils/validation/routesInputValidation';
import { body, CustomValidator } from 'express-validator';
import { ErrorCode } from 'types/ErrorCode';
import { ValidationError } from '../errors/ValidationError';
import { TransactionType } from 'types/TransactionType';
import Utils from '../Utils';

const atLeastOneFieldRequired: CustomValidator = (value, { req, path }) => {
    const { accountId, incomeId, categoryId, transactionTypeId, targetAccountId } = req.body;

    const validationMap: Record<
        TransactionType,
        { expectFields: Map<string, unknown>; notExpectFields: Map<string, unknown>; errorCode: ErrorCode; message: string }
    > = {
        [TransactionType.Income]: {
            expectFields: new Map().set('incomeId', incomeId).set('accountId', accountId),
            notExpectFields: new Map().set('categoryId', categoryId),
            errorCode: ErrorCode.INCOME_ID_ERROR,
            message: 'accountId and incomeId are required; categoryId should not be present.',
        },
        [TransactionType.Expense]: {
            expectFields: new Map().set('categoryId', categoryId).set('accountId', accountId),
            notExpectFields: new Map().set('incomeId', incomeId),
            errorCode: ErrorCode.CATEGORY_ID_ERROR,
            message: 'accountId and categoryId are required; incomeId should not be present.',
        },
        [TransactionType.Transafer]: {
            expectFields: new Map().set('accountId', accountId).set('targetAccountId', targetAccountId),
            notExpectFields: new Map().set('incomeId', incomeId).set('categoryId', categoryId),
            errorCode: ErrorCode.ACCOUNT_ID_ERROR,
            message: 'accountId is required; incomeId and categoryId should not be present.',
        },
    };

    const validation = validationMap[transactionTypeId as TransactionType];

    if (!validation) {
        throw new ValidationError({
            message: `Invalid transaction type at '${path}'`,
            errorCode: ErrorCode.TRANSACTION_TYPE_ID_ERROR,
        });
    }

    for (const field of validation.expectFields.keys()) {
        if (Utils.isNull(validation.expectFields.get(field as string))) {
            throw new ValidationError({
                message: `Validation failed at '${path}': Missing required field '${field}'.`,
                errorCode: validation.errorCode,
            });
        }
    }

    for (const field of validation.notExpectFields.keys()) {
        if (Utils.isNotNull(validation.notExpectFields.get(field as string))) {
            throw new ValidationError({
                message: `Validation failed at '${path}': Field '${field}' should not be present.`,
                errorCode: ErrorCode.UNEXPECTED_PROPERTY,
            });
        }
    }

    return true;
};

const createTransactionValidationRules = [
    body('transactionTypeId').custom(atLeastOneFieldRequired).bail(),
    ...createSignupValidationRules('currencyId', 'number', { optional: true }),
    ...createSignupValidationRules('transactionTypeId', 'number', {}),
    ...createSignupValidationRules('amount', 'number', {}),
    ...createSignupValidationRules('description', 'string', { max: 200, min: 3, optional: true }),
    ...createSignupValidationRules('accountId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('incomeId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('targetAccountId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('categoryId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('createAt', 'date', {
        optional: true,
    }),
];

const patchTransactionValidationRules = [
    ...createSignupValidationRules('transactionTypeId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('currencyId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('amount', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('description', 'string', {
        optional: true,
        max: 200,
        min: 3,
    }),
    ...createSignupValidationRules('accountId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('incomeId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('targetAccountId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('categoryId', 'number', {
        optional: true,
    }),
    ...createSignupValidationRules('createAt', 'date', {
        optional: true,
    }),
];

export const transactionConvertValidationMessageToErrorCode = (path: string): ErrorCode => {
    switch (path) {
        case 'targetAccountId': {
            return ErrorCode.TARGET_ACCOUNT_ID_ERROR;
        }
        case 'accountId': {
            return ErrorCode.ACCOUNT_ID_ERROR;
        }
        case 'incomeId': {
            return ErrorCode.INCOME_ID_ERROR;
        }
        case 'categoryId': {
            return ErrorCode.CATEGORY_ID_ERROR;
        }
        case 'currencyId': {
            return ErrorCode.CURRENCY_ID_ERROR;
        }
        case 'transactionTypeId': {
            return ErrorCode.TRANSACTION_TYPE_ID_ERROR;
        }
        case 'amount': {
            return ErrorCode.AMOUNT_ERROR;
        }
        case 'description': {
            return ErrorCode.DESCRIPTION_ERROR;
        }
        case 'createAt': {
            return ErrorCode.CREATE_DATE_ERROR;
        }
        default: {
            return ErrorCode.TRANSACTION_ERROR;
        }
    }
};

export { createTransactionValidationRules, patchTransactionValidationRules };
