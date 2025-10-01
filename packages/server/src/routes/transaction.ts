import { TransactionController } from 'controllers/TransactionController';
import express from 'express';
import {
    transactionConvertValidationMessageToErrorCode,
    createTransactionValidationRules,
    patchTransactionValidationRules,
} from 'src/utils/validation/transactionValidationRules';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';
import { validatePathQueryProperty } from 'src/utils/validation/validatePathQueryProperty';

const transactionRouter = express.Router({ mergeParams: true });

transactionRouter.post(
    '/',
    validateQuery({}),
    sanitizeRequestBody([
        'accountId',
        'incomeId',
        'categoryId',
        'currencyId',
        'transactionTypeId',
        'amount',
        'createAt',
        'targetAccountId',
        'description',
    ]),
    routesInputValidation(createTransactionValidationRules, transactionConvertValidationMessageToErrorCode),
    TransactionController.create,
);

transactionRouter.get(
    '/',
    validateQuery({
        cursor: 'number',
        limit: 'number',
        accountId: 'number?',
        categoryId: 'number?',
        incomeId: 'number?',
        orderBy: 'string?',
    }),
    TransactionController.getAll,
);

transactionRouter.get(
    '/:transactionId',
    validateQuery({}),
    routesInputValidation([validatePathQueryProperty('transactionId')]),
    TransactionController.get,
);

transactionRouter.delete(
    '/:transactionId',
    validateQuery({}),
    routesInputValidation([validatePathQueryProperty('transactionId')]),
    TransactionController.delete,
);

transactionRouter.patch(
    '/:transactionId',
    validateQuery({}),
    routesInputValidation([validatePathQueryProperty('transactionId')]),
    sanitizeRequestBody([
        'accountId',
        'incomeId',
        'categoryId',
        'currencyId',
        'amount',
        'description',
        'createAt',
        'targetAccountId',
    ]),
    routesInputValidation(patchTransactionValidationRules, transactionConvertValidationMessageToErrorCode),
    TransactionController.patch,
);

export default transactionRouter;
