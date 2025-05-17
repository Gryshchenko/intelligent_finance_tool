import { TransactionController } from 'controllers/TransactionController';
import express from 'express';
import {
    transactionConvertValidationMessageToErrorCode,
    createTransactionValidationRules,
    patchTransactionValidationRules,
} from 'src/utils/validation/transactionValidationRules';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { sanitizeRequestQuery } from 'src/utils/validation/sanitizeRequestQuery';

const transactionRouter = express.Router({ mergeParams: true });

transactionRouter.post(
    '/',
    sanitizeRequestQuery([]),
    sanitizeRequestBody([
        'accountId',
        'incomeId',
        'categoryId',
        'currencyId',
        'transactionTypeId',
        'amount',
        'description',
        'createAt',
        'targetAccountId',
    ]),
    routesInputValidation(createTransactionValidationRules, transactionConvertValidationMessageToErrorCode),
    TransactionController.create,
);

transactionRouter.get('/:transactionId', sanitizeRequestQuery([]), TransactionController.get);

transactionRouter.delete('/:transactionId', sanitizeRequestQuery([]), TransactionController.delete);

transactionRouter.patch(
    '/:transactionId',
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
    sanitizeRequestQuery([]),
    TransactionController.patch,
);

export default transactionRouter;
