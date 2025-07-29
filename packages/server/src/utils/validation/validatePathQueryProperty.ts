import { param } from 'express-validator';

const validatePathQueryProperty = (idName: string) => {
    return param(idName)
        .isNumeric()
        .withMessage(`Field Id must be a numeric value`)
        .bail()
        .isInt({ min: 0, max: Number.MAX_SAFE_INTEGER })
        .withMessage(`Field userId must be a numeric value`);
};

export { validatePathQueryProperty };
