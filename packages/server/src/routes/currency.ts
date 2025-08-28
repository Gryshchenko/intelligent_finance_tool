import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { CurrencyController } from 'controllers/CurrencyController';
import tokenVerify from 'middleware/tokenVerify';
import userStatusVerify from 'middleware/userStatusVerify';
import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

const currencyRouter = express.Router({ mergeParams: true });

currencyRouter.use(tokenVerify, userStatusVerify(UserStatus.ACTIVE));

currencyRouter.get('/', validateQuery({ currency: 'string' }), routesInputValidation([]), CurrencyController.get);

export default currencyRouter;
