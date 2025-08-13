import { createSignupValidationRules } from 'src/utils/validation/routesInputValidation';

const signupConfirmMailValidationRules = [
    ...createSignupValidationRules('confirmationCode', 'number', {
        min: 8,
        max: 8,
    }),
];

export default signupConfirmMailValidationRules;
