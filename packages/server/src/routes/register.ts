import express from 'express';
import signupValidationRules from 'src/utils/validation/signupValidationRules';
import routesInputValidation from '../utils/validation/routesInputValidation';
import { RegisterController } from 'src/controllers/RegisterController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';
import signupConfirmMailValidationRules from 'src/utils/validation/signupConfirmMailValidationRules';
import tokenVerify from 'middleware/tokenVerify';
import sessionVerify from 'middleware/sessionVerify';
import userIdVerify from 'middleware/userIdVerify';
import userStatusVerify from 'middleware/userStatusVerify';
import { UserStatus } from 'tenpercent/shared/src/interfaces/UserStatus';

const router = express.Router();

router.post(
    '/signup',
    sanitizeRequestBody(['email', 'password', 'locale', 'publicName']),
    validateQuery({}),
    routesInputValidation(signupValidationRules),
    RegisterController.signup,
);

router.post(
    '/signup/:userId/confirm-mail',
    tokenVerify,
    sessionVerify,
    userIdVerify,
    userStatusVerify(UserStatus.NO_VERIFIED),
    sanitizeRequestBody(['confirmationCode']),
    validateQuery({}),
    routesInputValidation(signupConfirmMailValidationRules),
    RegisterController.signUpConfirmMail,
);

export default router;
