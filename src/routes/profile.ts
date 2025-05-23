import express from 'express';
import { ProfileController } from 'controllers/ProfileController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { validateQuery } from 'src/utils/validation/validateQuery';

const router = express.Router({ mergeParams: true });

router.get('/', sanitizeRequestBody([]), validateQuery({}), ProfileController.profile);

export default router;
