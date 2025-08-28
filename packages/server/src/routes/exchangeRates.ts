import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { ExchangeRateController } from 'controllers/ExchangeRateController';
import tokenVerify from 'middleware/tokenVerify';
import userStatusVerify from 'middleware/userStatusVerify';
import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

const exchangeRates = express.Router({ mergeParams: true });

exchangeRates.use(tokenVerify, userStatusVerify(UserStatus.ACTIVE));

exchangeRates.get(
    '/',
    validateQuery({ currency: 'string', targetCurrency: 'string' }),
    routesInputValidation([]),
    ExchangeRateController.get,
);

export default exchangeRates;
