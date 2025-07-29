import { IncomeController } from 'controllers/IncomeController';
import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import {
    incomeConvertValidationMessageToErrorCode,
    createIncomeValidationRules,
    patchIncomeValidationRules,
} from 'src/utils/validation/incomeValidationRules';
import { validatePathQueryProperty } from 'src/utils/validation/validatePathQueryProperty';

const incomeRouter = express.Router({ mergeParams: true });

incomeRouter.post(
    '/',
    validateQuery({}),
    sanitizeRequestBody(['currencyId', 'incomeName', 'amount']),
    routesInputValidation(createIncomeValidationRules, incomeConvertValidationMessageToErrorCode),
    IncomeController.post,
);

incomeRouter.get(
    '/:incomeId',
    validateQuery({}),
    routesInputValidation([validatePathQueryProperty('incomeId')]),
    IncomeController.get,
);

incomeRouter.delete(
    '/:incomeId',
    validateQuery({}),
    routesInputValidation([validatePathQueryProperty('incomeId')]),
    IncomeController.delete,
);

incomeRouter.patch(
    '/:incomeId',
    validateQuery({}),
    sanitizeRequestBody(['incomeName', 'status']),
    routesInputValidation(patchIncomeValidationRules, incomeConvertValidationMessageToErrorCode),
    routesInputValidation([validatePathQueryProperty('incomeId')]),
    IncomeController.patch,
);

incomeRouter.get('/', validateQuery({}), IncomeController.gets);

export default incomeRouter;
