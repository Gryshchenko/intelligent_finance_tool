import express from 'express';
import { OverviewController } from 'src/controllers/OverviewController';
import { sanitizeRequestBody } from 'src/utils/validation/sanitizeRequestBody';
import { sanitizeRequestQuery } from 'src/utils/validation/sanitizeRequestQuery';

const router = express.Router({ mergeParams: true });

router.get('/', sanitizeRequestQuery([]), sanitizeRequestBody([]), OverviewController.overview);

export default router;
