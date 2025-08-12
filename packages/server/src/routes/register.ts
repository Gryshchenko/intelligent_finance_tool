import express from 'express';
import signupValidationRules from 'src/utils/validation/signupValidationRules';
import routesInputValidation from '../utils/validation/routesInputValidation';
import { RegisterController } from 'src/controllers/RegisterController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';

const router = express.Router();

router.post(
    '/signup',
    sanitizeRequestBody(['email', 'password', 'locale', 'publicName']),
    validateQuery({}),
    routesInputValidation(signupValidationRules),
    RegisterController.signup,
);

export default router;
