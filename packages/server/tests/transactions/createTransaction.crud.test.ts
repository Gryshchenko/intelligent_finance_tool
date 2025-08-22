import { createUser, deleteUserAfterTest, generateSecureRandom } from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const app = require('../../src/app');

let server: never;

let userIds: number[] = [];

beforeAll(() => {
    const port = Math.floor(generateSecureRandom() * (65535 - 1024) + 1024);

    // @ts-expect-error is necessary
    server = app.listen(port);
});

afterAll((done) => {
    userIds.forEach((id) => {
        deleteUserAfterTest(id, DatabaseConnection.instance(config));
    });
    userIds = [];
    // @ts-expect-error is necessary
    server.close(done);
});

describe('PATCH /transaction/patch - amount', () => {
    it(`should create new transaction amount, createAt, description`, async () => {
        const agent = request.agent(app);

        const databaseConnection = DatabaseConnection.instance(config);
        const { userId, authorization } = await createUser({
            agent,
            databaseConnection,
        });

        userIds.push(userId);
        const {
            body: {
                data: { accounts },
            },
        } = await agent.get(`/user/${userId}/overview/`).set('authorization', authorization).send({}).expect(HttpCode.OK);

        const accountId = accounts[0].accountId;
        const currencyId = accounts[0].currencyId;
        const targetAccountId = accounts[1].accountId;

        const response = await agent
            .post(`/user/${userId}/transaction/`)
            .set('authorization', authorization)
            .send({
                accountId,
                currencyId,
                transactionTypeId: 3,
                targetAccountId,
                amount: 1000,
                description: 'Test',
            })
            .expect(HttpCode.CREATED);
        const transaction = await agent
            .get(`/user/${userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', authorization)
            .expect(HttpCode.OK);

        const newDate = new Date().toISOString();
        expect(transaction.body.data.amount).toStrictEqual('1000');
        expect(transaction.body.data.description).toStrictEqual('Test');
        expect(transaction.body.data.targetAccountId).toStrictEqual(targetAccountId);
        expect(transaction.body.data.accountId).toStrictEqual(accountId);

        await agent
            .patch(`/user/${userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', authorization)
            .send({
                amount: 1500,
                description: 'Test 1',
                createAt: newDate,
                targetAccountId: accountId,
                accountId: targetAccountId,
            })
            .expect(HttpCode.NO_CONTENT);
        const transactionPatch = await agent
            .get(`/user/${userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', authorization)
            .expect(HttpCode.OK);

        expect(transactionPatch.body.data.amount).toStrictEqual('1500');
        expect(transactionPatch.body.data.description).toStrictEqual('Test 1');
        expect(transactionPatch.body.data.targetAccountId).toStrictEqual(accountId);
        expect(transactionPatch.body.data.accountId).toStrictEqual(targetAccountId);

        await agent
            .patch(`/user/${userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', authorization)
            .send({
                testq: 'something wrong',
            })
            .expect(HttpCode.BAD_REQUEST);

        await agent.get(`/user/${userId}/transaction/-100`).set('authorization', authorization).expect(HttpCode.BAD_REQUEST);

        await agent
            .delete(`/user/${userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', authorization)
            .expect(HttpCode.NO_CONTENT);
        await agent
            .get(`/user/${userId}/transaction/${response.body.data.transactionId}`)
            .set('authorization', authorization)
            .expect(HttpCode.NOT_FOUND);
    });
    it(`pagination`, async () => {
        const agent = request.agent(app);

        const databaseConnection = DatabaseConnection.instance(config);
        const { userId, authorization } = await createUser({
            agent,
            databaseConnection,
        });

        userIds.push(userId);
        const {
            body: {
                data: { accounts },
            },
        } = await agent.get(`/user/${userId}/overview/`).set('authorization', authorization).send({}).expect(HttpCode.OK);

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
                .post(`/user/${userId}/transaction/`)
                .set('authorization', authorization)
                .send({
                    accountId,
                    currencyId,
                    transactionTypeId: 3,
                    targetAccountId,
                    amount: num,
                    description: 'Test',
                })
                .expect(HttpCode.CREATED);
            transactionIds.push(transactionId);
        }
        const {
            body: {
                data: { limit, cursor, data },
            },
        } = await agent
            .get(`/user/${userId}/transactions/?limit=3&cursor=${transactionIds[0]}`)
            .set('authorization', authorization)
            .expect(HttpCode.OK);
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
            .get(`/user/${userId}/transactions/?limit=3&cursor=${transactionIds[3]}`)
            .set('authorization', authorization)
            .expect(HttpCode.OK);
        expect(remainingData.length).toBeLessThanOrEqual(3);
        // @ts-expect-error is necessary
        expect(remainingData.map((t: unknown) => t.transactionId)).toStrictEqual([]);

        await agent
            .get(`/user/${userId}/transactions/?limit=3&cursor=invalid_cursor`)
            .set('authorization', authorization)
            .expect(HttpCode.BAD_REQUEST);
    });
});
