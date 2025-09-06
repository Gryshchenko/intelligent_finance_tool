import express from 'express';

import routesInputValidation from '../utils/validation/routesInputValidation';
import tokenVerify, { tokenLongVerify } from 'middleware/tokenVerify';
import loginValidationRules from 'src/utils/validation/loginValidationRules';
import { AuthController } from 'src/controllers/AuthController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';
import userIdVerify from 'middleware/userIdVerify';
import refreshTokenValidation from 'src/utils/validation/refreshTokenValidationRules';

const router = express.Router();

router.post('/logout', validateQuery({}), tokenVerify, routesInputValidation([]), AuthController.logout);

router.post(
    '/:userId/refresh',
    validateQuery({}),
    routesInputValidation(refreshTokenValidation),
    tokenLongVerify,
    userIdVerify,
    AuthController.refresh,
);

router.get('/:userId/verify', validateQuery({}), tokenVerify, userIdVerify, routesInputValidation([]), AuthController.verify);

router.post(
    '/login',
    validateQuery({}),
    sanitizeRequestBody(['email', 'password']),
    routesInputValidation(loginValidationRules),
    AuthController.login,
);

export default router;
