import express from 'express';
import sessionVerify from '../middleware/sessionVerify';
import tokenVerify from '../middleware/tokenVerify';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { param } from 'express-validator';
import overview from 'src/routes/overview';
import profile from 'src/routes/profile';
import transaction from 'src/routes/transaction';
import account from 'src/routes/account';
import userIdVerify from 'middleware/userIdVerify';

const userRouter = express.Router({ mergeParams: true });

const userIdValidator = param('userId')
    .isNumeric()
    .withMessage(`Field userId must be a numeric value`)
    .bail()
    .isInt({ min: 0, max: Number.MAX_SAFE_INTEGER })
    .withMessage(`Field userId must be a numeric value`);

userRouter.use(tokenVerify, sessionVerify);

userRouter.use('/:userId/profile', userIdVerify, routesInputValidation([userIdValidator]), profile);

userRouter.use('/:userId/overview', userIdVerify, routesInputValidation([userIdValidator]), overview);

userRouter.use('/:userId/transaction', userIdVerify, routesInputValidation([userIdValidator]), transaction);

userRouter.use('/:userId/transactions', userIdVerify, routesInputValidation([userIdValidator]), transaction);

userRouter.use('/:userId/account', userIdVerify, routesInputValidation([userIdValidator]), account);

export default userRouter;
