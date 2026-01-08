import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import passportSetup from './services/auth/passport-setup';

import authRouter from './routes/auth';
import registerRouter from './routes/register';
import userRouter from './routes/user';
import { getConfig } from 'src/config/config';
import ResponseBuilder from 'src/helper/responseBuilder/ResponseBuilder';
// import { swaggerInit } from 'src/swagger/swagger';
import { checkCors } from 'middleware/checkCors';
import { getLocalIP } from 'src/utils/getLocalIP';

import passport from 'passport';
import currencyRouter from 'routes/currency';
import exchangeRates from 'routes/exchangeRates';
import ExchangeRateServiceBuilder from 'services/ExchangeRateService/ExchangeRateServiceBuilder';
import Logger from 'helper/logger/Logger';
import { ResponseStatusType } from 'tenpercent/shared';
import { ErrorCode } from 'tenpercent/shared';
import * as process from 'node:process';
import { createServer } from 'src/createServer';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const app = express();
const port = getConfig().appPort ?? 3000;

passportSetup(passport);
// swaggerInit(app);

if (process.env.NODE_ENV !== '') {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 min
        limit: 100,
    });
    app.use(limiter);
}
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(10000, () => {
        res.status(408).send(
            new ResponseBuilder()
                .setStatus(ResponseStatusType.INTERNAL)
                .setError({ errorCode: ErrorCode.REQUEST_TIMEOUT_ERROR })
                .build(),
        );
    });
    next();
});

// app.use(checkOriginReferer);
app.use(checkCors());

app.use(express.json({ limit: '5kb' }));
app.use(express.urlencoded({ limit: '5kb', extended: true }));
app.use(express.json());
app.use(helmet());
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/register', registerRouter);
app.use('/currencies', currencyRouter);
app.use('/exchange-rates', exchangeRates);
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!');
});

const httpsServer = createServer(app);

if (process.env.NODE_ENV !== 'test') {
    httpsServer.listen(port, async () => {
        const ip = getLocalIP();
        ExchangeRateServiceBuilder.build()
            .updateCurrencyRates()
            .catch((e) => {
                Logger.Of('App').info(`Update currency failed due reason: ${(e as { message: string }).message}`);
            });
        Logger.Of('App').info(`Server running at: ${ip}:${port}`);
    });
}

module.exports = httpsServer;
