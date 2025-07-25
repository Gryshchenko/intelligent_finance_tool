import express, { NextFunction, Request, Response } from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import passportSetup from './services/auth/passport-setup';
import SessionService from './services/session/SessionService';

import authRouter from './routes/auth';
import registerRouter from './routes/register';
import userRouter from './routes/user';
import { getConfig } from 'src/config/config';
import ResponseBuilder from 'src/helper/responseBuilder/ResponseBuilder';
import { ResponseStatusType } from 'types/ResponseStatusType';
import { ErrorCode } from 'types/ErrorCode';
import { swaggerInit } from 'src/swagger/swagger';
import { checkOriginReferer } from 'middleware/checkOriginReferer';
import { checkCors } from 'middleware/checkCors';
import { getLocalIP } from 'src/utils/getLocalIP';

import passport from 'passport';
import currencyRouter from 'routes/currency';
import exchangeRates from 'routes/exchangeRates';
import ExchangeRateServiceBuilder from 'services/ExchangeRateService/ExchangeRateServiceBuilder';
import Logger from 'helper/logger/Logger';

const app = express();
const port = getConfig().appPort ?? 3000;

passportSetup(passport);
swaggerInit(app);

const privateKey = fs.readFileSync(path.join(__dirname, 'localhost.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'localhost.cert'), 'utf8');

const credentials = { key: privateKey, cert: certificate };

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    limit: 100,
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(10000, () => {
        res.status(408).send(
            new ResponseBuilder()
                .setStatus(ResponseStatusType.INTERNAL)
                .setError({ errorCode: ErrorCode.REQUEST_TIMEOUT })
                .build(),
        );
    });
    next();
});

app.use(checkOriginReferer);
app.use(checkCors());
app.use(express.json({ limit: '5kb' }));
app.use(express.urlencoded({ limit: '5kb', extended: true }));
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(passport.initialize());
app.use(SessionService.setup());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/register', registerRouter);
app.use('/currencies', currencyRouter);
app.use('/exchange-rates', exchangeRates);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!');
});

const httpsServer = https.createServer(credentials, app);

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
