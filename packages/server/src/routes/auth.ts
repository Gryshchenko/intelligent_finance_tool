import express from 'express';

import routesInputValidation from '../utils/validation/routesInputValidation';
import tokenVerify from 'middleware/tokenVerify';
import loginValidationRules from 'src/utils/validation/loginValidationRules';
import { AuthController } from 'src/controllers/AuthController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';

const router = express.Router();

router.post('/logout', validateQuery({}), tokenVerify, routesInputValidation([]), AuthController.logout);

router.post('/verify', validateQuery({}), tokenVerify, routesInputValidation([]), AuthController.verify);

router.post(
    '/login',
    validateQuery({}),
    sanitizeRequestBody(['email', 'password']),
    routesInputValidation(loginValidationRules),
    AuthController.login,
);

export default router;
