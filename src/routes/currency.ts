import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { CurrencyController } from 'controllers/CurrencyController';

const currencyRouter = express.Router({ mergeParams: true });

currencyRouter.get(
    '/',
    validateQuery({ currency: 'string', targetCurrency: 'string' }),
    routesInputValidation([]),
    CurrencyController.get,
);

export default currencyRouter;
