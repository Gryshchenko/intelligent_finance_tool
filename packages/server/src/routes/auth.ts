import express from 'express';

import routesInputValidation from '../utils/validation/routesInputValidation';
import tokenVerify from 'middleware/tokenVerify';
import loginValidationRules from 'src/utils/validation/loginValidationRules';
import sessionVerify from 'middleware/sessionVerify';
import { AuthController } from 'src/controllers/AuthController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';

const router = express.Router();

router.post('/logout', validateQuery({}), sessionVerify, tokenVerify, routesInputValidation([]), AuthController.logout);

router.post('/verify', validateQuery({}), tokenVerify, sessionVerify, routesInputValidation([]), AuthController.verify);

router.post(
    '/login',
    validateQuery({}),
    sanitizeRequestBody(['email', 'password']),
    routesInputValidation(loginValidationRules),
    AuthController.login,
);

export default router;
