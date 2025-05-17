import express from 'express';
import { ProfileController } from 'controllers/ProfileController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { sanitizeRequestQuery } from 'src/utils/validation/sanitizeRequestQuery';

const router = express.Router({ mergeParams: true });

router.get('/', sanitizeRequestBody([]), sanitizeRequestQuery([]), ProfileController.profile);

export default router;
