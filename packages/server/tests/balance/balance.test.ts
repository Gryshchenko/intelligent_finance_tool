// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { deleteUserAfterTest, generateRandomEmail, generateRandomPassword, generateSecureRandom } from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';
import Utils from '../../src/utils/Utils';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const app = require('../../src/app');

let server;

let userIds = [];

beforeAll(() => {
    const port = Math.floor(generateSecureRandom() * (65535 - 1024) + 1024);

    server = app.listen(port);
});

afterAll((done) => {
    userIds.forEach((id) => {
        deleteUserAfterTest(id, DatabaseConnection.instance(config));
    });
    userIds = [];
    server.close(done);
});

describe('POST /balance', () => {
    it(`create income transaction and increase balance`, async () => {
        let sum = 0;
        const agent = request.agent(app);
        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword() })
            .expect(200);
        userIds.push(create_user.body.data.userId);

        const overview = await agent
            .get(`/user/${create_user.body.data.userId}/overview/`)
            .set('authorization', create_user.header['authorization'])
            .send({})
            .expect(200);
        const {
            body: {
                data: { accounts, incomes },
            },
        } = overview;

        const incomeId = incomes[0].incomeId;
        const accountId = accounts[0].accountId;
        const currencyId = accounts[0].currencyId;

        for (const num of [10, 20, 32, 42.23, 4342, 342425, 32424.34, 324234.54, 5345345.345345, 5345345346.4554]) {
            sum += num;
            await agent
                .post(`/user/${create_user.body.data.userId}/transaction/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    incomeId,
                    accountId,
                    currencyId,
                    transactionTypeId: 1,
                    amount: num,
                    description: 'Test',
                })
                .expect(201);
            const {
                body: {
                    data: { balanceId, balance },
                },
            } = await agent
                .get(`/user/${create_user.body.data.userId}/balance`)
                .set('authorization', create_user.header['authorization'])
                .send({})
                .expect(200);
            expect(balanceId).toBeTruthy();
            expect(Number(balance).toFixed(2)).toBe(String(sum.toFixed(2)));
        }
    });
    it(`create income transaction and decrease balance`, async () => {
        let sum = 0;
        const agent = request.agent(app);
        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword() })
            .expect(200);
        userIds.push(create_user.body.data.userId);
        const overview = await agent
            .get(`/user/${create_user.body.data.userId}/overview/`)
            .set('authorization', create_user.header['authorization'])
            .send({})
            .expect(200);
        const {
            body: {
                data: { accounts, categories },
            },
        } = overview;

        const accountId = accounts[0].accountId;
        const currencyId = accounts[0].currencyId;
        const categoryId = categories[0].categoryId;

        for (const num of [10, 20, 32, 42.23, 4342, 342425, 32424.34, 324234.54, 5345345.345345, 5345345346.4554]) {
            sum -= num;
            await agent
                .post(`/user/${create_user.body.data.userId}/transaction/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    categoryId,
                    accountId,
                    currencyId,
                    transactionTypeId: 2,
                    amount: num,
                    description: 'Test',
                })
                .expect(201);
            const {
                body: {
                    data: { balanceId, balance },
                },
            } = await agent
                .get(`/user/${create_user.body.data.userId}/balance`)
                .set('authorization', create_user.header['authorization'])
                .send({})
                .expect(200);
            expect(balanceId).toBeTruthy();
            expect(Number(balance).toFixed(2)).toBe(String(sum.toFixed(2)));
        }
    });

    it(`updates balance after modifying transaction amount`, async () => {
        const agent = request.agent(app);
        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword() })
            .expect(200);
        userIds.push(create_user.body.data.userId);
        const getBalance = async (id: string) => {
            const {
                body: {
                    data: { balance },
                },
            } = await agent
                .get(`/user/${id}/balance`)
                .set('authorization', create_user.header['authorization'])
                .send({})
                .expect(200);
            return balance;
        };
        const overview = await agent
            .get(`/user/${create_user.body.data.userId}/overview/`)
            .set('authorization', create_user.header['authorization'])
            .send({})
            .expect(200);
        const {
            body: {
                data: { accounts, incomes },
            },
        } = overview;

        const accountId = accounts[0].accountId;
        const currencyId = accounts[0].currencyId;
        const incomeId = incomes[0].incomeId;

        for (const num of [[1000, 400]]) {
            const [create, modify] = num;
            const originalBalance = await getBalance(create_user.body.data.userId);
            const {
                body: {
                    data: { transactionId },
                },
            } = await agent
                .post(`/user/${create_user.body.data.userId}/transaction/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    accountId,
                    incomeId,
                    currencyId,
                    transactionTypeId: 1,
                    amount: create,
                    description: 'Test',
                })
                .expect(201);

            expect(Utils.roundNumber(await getBalance(create_user.body.data.userId))).toBe(
                Utils.roundNumber(originalBalance + create),
            );
            const get = await agent
                .get(`/user/${create_user.body.data.userId}/transaction/${transactionId}`)
                .set('authorization', create_user.header['authorization'])
                .send()
                .expect(200);
            expect(Utils.roundNumber(get.body.data.amount)).toBe(Utils.roundNumber(create));
            await agent
                .patch(`/user/${create_user.body.data.userId}/transaction/${transactionId}`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    amount: modify,
                })
                .expect(204);
            const afterPatch = await agent
                .get(`/user/${create_user.body.data.userId}/transaction/${transactionId}`)
                .set('authorization', create_user.header['authorization'])
                .send()
                .expect(200);
            expect(Utils.roundNumber(afterPatch.body.data.amount)).toBe(Utils.roundNumber(modify));
            expect(Utils.roundNumber(await getBalance(create_user.body.data.userId))).toBe(Utils.roundNumber(modify));
            await agent
                .delete(`/user/${create_user.body.data.userId}/transaction/${transactionId}`)
                .set('authorization', create_user.header['authorization'])
                .send()
                .expect(204);
            expect(Utils.roundNumber(await getBalance(create_user.body.data.userId))).toBe(Utils.roundNumber(originalBalance));
        }
    });
    it('updates balance after adding accounts in other currencies', async () => {
        const agent = request.agent(app);
        const newAmount = 1000;

        const registerUser = async () => {
            const res = await agent
                .post('/register/signup')
                .send({ email: generateRandomEmail(5), password: generateRandomPassword() })
                .expect(200);
            return { userId: res.body.data.userId, auth: res.header['authorization'] };
        };

        const getCurrencyData = async (currency: string, auth: string) => {
            const res = await agent.get(`/currencies/?currency=${currency}`).set('authorization', auth).expect(200);
            return res.body.data;
        };

        const getExchangeRate = async (base: string, target: string, auth: string) => {
            const res = await agent
                .get(`/exchange-rates/?currency=${base}&targetCurrency=${target}`)
                .set('authorization', auth)
                .expect(200);
            return Number(res.body.data.rate);
        };

        const getExchangeRateFailed = async (base: string, target: string, auth: string) => {
            return await agent
                .get(`/exchange-rates/?currency=${base}&targetCurrency=${target}`)
                .set('authorization', auth)
                .expect(404);
        };

        const getBalance = async (userId: string, auth: string) => {
            const res = await agent.get(`/user/${userId}/balance`).set('authorization', auth).expect(200);
            return Number(res.body.data.balance);
        };

        const createAccount = async (userId: string, currencyId: string, currency: string, auth: string) => {
            const res = await agent
                .post(`/user/${userId}/account/`)
                .set('authorization', auth)
                .send({
                    accountName: `Test EURO ${currency}`,
                    amount: newAmount,
                    currencyId,
                })
                .expect(200);
            return res.body.data;
        };
        const createAccountFailed = async (userId: string, currencyId: string, currency: string, auth: string) => {
            return await agent
                .post(`/user/${userId}/account/`)
                .set('authorization', auth)
                .send({
                    accountName: `Test EURO ${currency}`,
                    amount: newAmount,
                    currencyId,
                })
                .expect(404);
        };

        const { userId, auth } = await registerUser();
        userIds.push(userId);

        let expectedBalance = 0;
        const currencies = ['EUR', 'GBP', 'CHF', 'DKK', 'NOK'];
        const unsupportCurrency = ['BB', 'CCC', 111];

        for (const currency of currencies) {
            const currencyData = await getCurrencyData(currency, auth);
            const rate = await getExchangeRate('USD', currency, auth);

            const account = await createAccount(userId, currencyData.currencyId, currency, auth);

            expectedBalance += Utils.roundNumber(newAmount * rate);

            expect(account.accountId).toBeTruthy();
            expect(Number(account.amount)).toBe(newAmount);
            expect(account.accountName).toBe(`Test EURO ${currency}`);

            const currentBalance = Utils.roundNumber(await getBalance(userId, auth));
            expect(currentBalance).toBe(Utils.roundNumber(expectedBalance));
        }
        for (const currency of unsupportCurrency) {
            const data = await getExchangeRateFailed('USD', currency, auth);
            expect(data.body.errors.length).toBe(1);
            const {
                body: { errors },
            } = await createAccountFailed(userId, '-999', currency, auth);
            expect(errors.length).toBe(1);
        }
    });
});
