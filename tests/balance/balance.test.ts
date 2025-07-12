// @ts-nocheck
import {
    deleteUserAfterTest,
    generateRandomEmail,
    generateRandomPassword,
    generateRandomString,
    generateSecureRandom,
} from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';
import Utils from '../../src/utils/Utils';

const request = require('supertest');
require('dotenv').config();
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

    it(`modify transaction and check balance`, async () => {
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
                data: { accounts, categories, incomes },
            },
        } = overview;

        const accountId = accounts[0].accountId;
        const currencyId = accounts[0].currencyId;
        const incomeId = incomes[0].incomeId;
        const getBalance = async () => {
            const {
                body: {
                    data: { balance },
                },
            } = await agent
                .get(`/user/${create_user.body.data.userId}/balance`)
                .set('authorization', create_user.header['authorization'])
                .send({})
                .expect(200);
            return balance;
        };

        for (const num of [[1000, 400]]) {
            const [create, modify] = num;
            const originalBalance = await getBalance();
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

            expect(Utils.roundNumber(await getBalance())).toBe(Utils.roundNumber(originalBalance + create));
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
            expect(Utils.roundNumber(await getBalance())).toBe(Utils.roundNumber(originalBalance - 600));
        }
    });
});
