import express from 'express';

import routesInputValidation from '../utils/validation/routesInputValidation';
import { tokenVerifyLogout } from '../middleware/tokenVerify';
import loginValidationRules from 'src/utils/validation/loginValidationRules';
import { sessionVerifyLogout } from '../middleware/sessionVerify';
import { AuthController } from 'src/controllers/AuthController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { sanitizeRequestQuery } from 'src/utils/validation/sanitizeRequestQuery';

const router = express.Router();

router.post('/logout', sanitizeRequestQuery([]), tokenVerifyLogout, sessionVerifyLogout, AuthController.logout);

router.post(
    '/login',
    sanitizeRequestQuery([]),
    sanitizeRequestBody(['email', 'password']),
    routesInputValidation(loginValidationRules),
    AuthController.login,
);

export default router;
