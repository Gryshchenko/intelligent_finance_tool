import express from 'express';
import sessionVerify from '../middleware/sessionVerify';
import tokenVerify from '../middleware/tokenVerify';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import overview from 'src/routes/overview';
import profile from 'src/routes/profile';
import transaction from 'src/routes/transaction';
import account from 'src/routes/account';
import userIdVerify from 'middleware/userIdVerify';
import { validatePathQueryProperty } from 'src/utils/validation/validatePathQueryProperty';
import income from 'routes/income';
import category from 'routes/category';
import balance from 'routes/balance';
import { UserController } from 'controllers/UserController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';
import userStatusVerify from 'middleware/userStatusVerify';
import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

const userRouter = express.Router({ mergeParams: true });

userRouter.use(tokenVerify, sessionVerify, userStatusVerify(UserStatus.ACTIVE));

userRouter.get(
    '/:userId',
    userIdVerify,
    routesInputValidation([validatePathQueryProperty('userId')]),
    sanitizeRequestBody([]),
    validateQuery({}),
    UserController.get,
);

userRouter.use('/:userId/profile', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), profile);

userRouter.use('/:userId/overview', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), overview);

userRouter.use('/:userId/transaction', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), transaction);

userRouter.use('/:userId/transactions', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), transaction);

userRouter.use('/:userId/account', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), account);

userRouter.use('/:userId/accounts', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), account);

userRouter.use('/:userId/income', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), income);

userRouter.use('/:userId/incomes', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), income);

userRouter.use('/:userId/category', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), category);

userRouter.use('/:userId/categories', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), category);

userRouter.use('/:userId/balance', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), balance);

// userRouter.use('/:userId/email-change', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), emailConfirmation);
// userRouter.use('/:userId/email-change/verify', userIdVerify, routesInputValidation([validatePathQueryProperty('userId')]), emailConfirmation);

export default userRouter;
