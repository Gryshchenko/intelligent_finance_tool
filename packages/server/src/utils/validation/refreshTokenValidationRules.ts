import { createSignupValidationRules } from 'src/utils/validation/routesInputValidation';

const refreshTokenValidation = [...createSignupValidationRules('token', 'string')];

export default refreshTokenValidation;
