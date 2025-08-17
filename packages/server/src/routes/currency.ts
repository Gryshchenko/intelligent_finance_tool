import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { CurrencyController } from 'controllers/CurrencyController';
import tokenVerify from 'middleware/tokenVerify';
import sessionVerify from 'middleware/sessionVerify';
import userRouter from 'routes/user';
import userStatusVerify from 'middleware/userStatusVerify';
import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

const currencyRouter = express.Router({ mergeParams: true });

userRouter.use(tokenVerify, sessionVerify, userStatusVerify(UserStatus.ACTIVE));

currencyRouter.get('/', validateQuery({ currency: 'string' }), routesInputValidation([]), CurrencyController.get);

export default currencyRouter;
