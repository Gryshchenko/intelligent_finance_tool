import { AccountController } from 'controllers/AccountController';
import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import {
    accountConvertValidationMessageToErrorCode,
    createAccountValidationRules,
    patchAccountValidationRules,
} from 'src/utils/validation/accountValidationRules';

const accountRouter = express.Router({ mergeParams: true });

accountRouter.post(
    '/',
    validateQuery({}),
    sanitizeRequestBody(['currencyId', 'accountName', 'amount']),
    routesInputValidation(createAccountValidationRules, accountConvertValidationMessageToErrorCode),
    AccountController.post,
);

accountRouter.get('/:accountId', validateQuery({}), AccountController.get);

accountRouter.delete('/:accountId', validateQuery({ accountStatusType: 'number' }), AccountController.delete);

accountRouter.patch(
    '/:accountId',
    validateQuery({}),
    sanitizeRequestBody(['accountName', 'amount']),
    routesInputValidation(patchAccountValidationRules, accountConvertValidationMessageToErrorCode),
    AccountController.patch,
);

accountRouter.get('/', validateQuery({}), AccountController.gets);

export default accountRouter;
