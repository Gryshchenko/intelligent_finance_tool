import express from 'express';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { CurrencyController } from 'controllers/CurrencyController';
import tokenVerify from 'middleware/tokenVerify';
import userStatusVerify from 'middleware/userStatusVerify';
import { UserStatus } from 'tenpercent/shared';

const currencyRouter = express.Router({ mergeParams: true });

currencyRouter.use(tokenVerify, userStatusVerify(UserStatus.ACTIVE));

currencyRouter.get('/', routesInputValidation([]), CurrencyController.gets);

export default currencyRouter;
