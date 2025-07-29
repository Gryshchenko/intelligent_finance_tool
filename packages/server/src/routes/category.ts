import { CategoryController } from 'controllers/CategoryController';
import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import {
    categoryConvertValidationMessageToErrorCode,
    createCategoryValidationRules,
    patchCategoryValidationRules,
} from 'src/utils/validation/categoryValidationRules';
import { validatePathQueryProperty } from 'src/utils/validation/validatePathQueryProperty';

const categoryRouter = express.Router({ mergeParams: true });

categoryRouter.post(
    '/',
    validateQuery({}),
    sanitizeRequestBody(['currencyId', 'categoryName']),
    routesInputValidation(createCategoryValidationRules, categoryConvertValidationMessageToErrorCode),
    CategoryController.post,
);

categoryRouter.get(
    '/:categoryId',
    validateQuery({}),
    routesInputValidation([validatePathQueryProperty('categoryId')]),
    CategoryController.get,
);

categoryRouter.delete(
    '/:categoryId',
    validateQuery({}),
    routesInputValidation([validatePathQueryProperty('categoryId')]),
    CategoryController.delete,
);

categoryRouter.patch(
    '/:categoryId',
    validateQuery({}),
    sanitizeRequestBody(['categoryName', 'status']),
    routesInputValidation(patchCategoryValidationRules, categoryConvertValidationMessageToErrorCode),
    routesInputValidation([validatePathQueryProperty('categoryId')]),
    CategoryController.patch,
);

categoryRouter.get('/', validateQuery({}), CategoryController.gets);

export default categoryRouter;
