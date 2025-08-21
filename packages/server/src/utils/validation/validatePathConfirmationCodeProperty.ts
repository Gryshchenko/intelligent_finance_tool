import { body } from 'express-validator';

const validatePathConfirmationCodeProperty = (idName: string) => {
    return body(idName)
        .isInt({ min: 0, max: Number.MAX_SAFE_INTEGER })
        .withMessage(`Field confirmationCode must be a numeric value`)
        .bail()
        .custom((value) => {
            if (value.toString().length !== 8) {
                throw new Error('Field confirmationCode must be exactly 8 digits');
            }
            return true;
        });
};

export { validatePathConfirmationCodeProperty };
