// @ts-nocheck
import { deleteUserAfterTest, generateRandomEmail, generateRandomPassword, generateSecureRandom } from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';

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

describe('PATCH /transaction/patch - amount', () => {
    it(`should create new transaction amount, createAt, description`, async () => {
        const agent = request.agent(app);

        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        const {
            body: {
                data: { accounts },
            },
        } = await agent
            .get(`/user/${create_user.body.data.userId}/overview/`)
            .set('authorization', create_user.header['authorization'])
            .send({})
            .expect(200);

        const accountId = accounts[0].accountId;
        const currencyId = accounts[0].currencyId;
        const targetAccountId = accounts[1].accountId;

        const response = await agent
            .post(`/user/${create_user.body.data.userId}/transaction/`)
            .set('authorization', create_user.header['authorization'])
            .send({
                accountId,
                currencyId,
                transactionTypeId: 3,
                targetAccountId,
                amount: 1000,
                description: 'Test',
            })
            .expect(201);
        const transaction = await agent
            .get(`/user/${create_user.body.data.userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(200);

        const newDate = new Date().toISOString();
        expect(transaction.body.data.amount).toStrictEqual('1000');
        expect(transaction.body.data.description).toStrictEqual('Test');
        expect(transaction.body.data.targetAccountId).toStrictEqual(targetAccountId);
        expect(transaction.body.data.accountId).toStrictEqual(accountId);

        await agent
            .patch(`/user/${create_user.body.data.userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', create_user.header['authorization'])
            .send({
                amount: 1500,
                description: 'Test 1',
                createAt: newDate,
                targetAccountId: accountId,
                accountId: targetAccountId,
            })
            .expect(204);
        const transactionPatch = await agent
            .get(`/user/${create_user.body.data.userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(200);

        expect(transactionPatch.body.data.amount).toStrictEqual('1500');
        expect(transactionPatch.body.data.description).toStrictEqual('Test 1');
        expect(transactionPatch.body.data.targetAccountId).toStrictEqual(accountId);
        expect(transactionPatch.body.data.accountId).toStrictEqual(targetAccountId);

        await agent
            .patch(`/user/${create_user.body.data.userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', create_user.header['authorization'])
            .send({
                testq: 'something wrong',
            })
            .expect(400);

        await agent
            .get(`/user/${create_user.body.data.userId}/transaction/-100`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);

        await agent
            .delete(`/user/${create_user.body.data.userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(204);
        await agent
            .get(`/user/${create_user.body.data.userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(404);
    });
    it(`pagination`, async () => {
        const agent = request.agent(app);

        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        const {
            body: {
                data: { accounts },
            },
        } = await agent
            .get(`/user/${create_user.body.data.userId}/overview/`)
            .set('authorization', create_user.header['authorization'])
            .send({})
            .expect(200);

        const accountId = accounts[0].accountId;
        const currencyId = accounts[0].currencyId;
        const targetAccountId = accounts[1].accountId;
        const transactionIds = [];
        for (const num of Array(4).fill(100)) {
            const {
                body: {
                    data: { transactionId },
                },
            } = await agent
                .post(`/user/${create_user.body.data.userId}/transaction/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    accountId,
                    currencyId,
                    transactionTypeId: 3,
                    targetAccountId,
                    amount: num,
                    description: 'Test',
                })
                .expect(201);
            transactionIds.push(transactionId);
        }
        const {
            body: {
                data: { limit, cursor, data },
            },
        } = await agent
            .get(`/user/${create_user.body.data.userId}/transactions/?limit=3&cursor=${transactionIds[0]}`)
            .set('authorization', create_user.header['authorization'])
            .expect(200);
        expect(limit).toStrictEqual(3);
        expect(cursor).toStrictEqual(transactionIds[0]);
        expect(data.length).toStrictEqual(3);

        for (let i = 1; i < transactionIds.length; i += 1) {
            expect(transactionIds[i]).toStrictEqual(data[i - 1].transactionId);
        }

        const {
            body: {
                data: { data: remainingData },
            },
        } = await agent
            .get(`/user/${create_user.body.data.userId}/transactions/?limit=3&cursor=${transactionIds[3]}`)
            .set('authorization', create_user.header['authorization'])
            .expect(200);
        expect(remainingData.length).toBeLessThanOrEqual(3);
        expect(remainingData.map((t) => t.transactionId)).toStrictEqual([]);

        await agent
            .get(`/user/${create_user.body.data.userId}/transactions/?limit=3&cursor=invalid_cursor`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
    });
});
