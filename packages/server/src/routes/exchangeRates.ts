import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { ExchangeRateController } from 'controllers/ExchangeRateController';

const exchangeRates = express.Router({ mergeParams: true });

exchangeRates.get(
    '/',
    validateQuery({ currency: 'string', targetCurrency: 'string' }),
    routesInputValidation([]),
    ExchangeRateController.get,
);

export default exchangeRates;
