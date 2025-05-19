import { AccountController } from 'controllers/AccountController';
import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';

const accountRouter = express.Router({ mergeParams: true });

accountRouter.get('/:accountId', validateQuery({}), AccountController.get);

accountRouter.delete('/:accountId', validateQuery({}));

accountRouter.patch('/:accountId', validateQuery({}));

export default accountRouter;
