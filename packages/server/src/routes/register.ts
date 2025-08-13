import express from 'express';
import signupValidationRules from 'src/utils/validation/signupValidationRules';
import routesInputValidation from '../utils/validation/routesInputValidation';
import { RegisterController } from 'src/controllers/RegisterController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';
import signupConfirmMailValidationRules from 'src/utils/validation/signupConfirmMailValidationRules';
import tokenVerify from 'middleware/tokenVerify';
import sessionVerify from 'middleware/sessionVerify';

const router = express.Router();

router.post(
    '/signup',
    sanitizeRequestBody(['email', 'password', 'locale', 'publicName']),
    validateQuery({}),
    routesInputValidation(signupValidationRules),
    RegisterController.signup,
);

router.post(
    '/signup/confirm-mail',
    tokenVerify,
    sessionVerify,
    sanitizeRequestBody(['confirmationCode']),
    validateQuery({}),
    routesInputValidation(signupConfirmMailValidationRules),
    RegisterController.signUpConfirmMail,
);

export default router;
