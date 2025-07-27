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

const userRouter = express.Router({ mergeParams: true });

userRouter.use(tokenVerify, sessionVerify);

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

export default userRouter;
