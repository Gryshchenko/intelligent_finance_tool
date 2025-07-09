import express from 'express';
import { validateQuery } from 'src/utils/validation/validateQuery';
import routesInputValidation from 'src/utils/validation/routesInputValidation';
import { BalanceController } from 'controllers/BalanceController';

const balanceRouter = express.Router({ mergeParams: true });

balanceRouter.get('/', validateQuery({}), routesInputValidation([]), BalanceController.get);

export default balanceRouter;
