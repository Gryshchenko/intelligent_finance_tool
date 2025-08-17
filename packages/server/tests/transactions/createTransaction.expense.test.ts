import { createUser, deleteUserAfterTest, generateSecureRandom } from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const app = require('../../src/app');

let server: never;

let userIds: string[] = [];

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

describe('POST /transaction/create - expense', () => {
    [10, 20, 32, 42.23, 4342, 342425, 32424.34, 324234.54, 5345345.345345, 5345345346.4554].forEach(async (num) => {
        await it(`should create new transaction num: ${num}`, async () => {
            const agent = request.agent(app);

            const databaseConnection = DatabaseConnection.instance(config);
            const { userId, authorization } = await createUser({
                agent,
                databaseConnection,
            });
            userIds.push(userId);
            const overview = await agent
                .get(`/user/${userId}/overview/`)
                .set('authorization', authorization)
                .send({})
                .expect(200);
            const {
                body: {
                    data: { accounts, categories },
                },
            } = overview;

            // const incomeId = incomes[0].incomeId;
            const accountId = accounts[0].accountId;
            const currencyId = accounts[0].currencyId;
            const categoryId = categories[0].categoryId;

            const {
                body: { data: accountBefor },
            } = await agent.get(`/user/${userId}/account/${accountId}`).set('authorization', authorization).send({}).expect(200);

            const response = await agent
                .post(`/user/${userId}/transaction/`)
                .set('authorization', authorization)
                .send({
                    accountId,
                    currencyId,
                    transactionTypeId: 2,
                    amount: num,
                    description: 'Test',
                    categoryId,
                })
                .expect(201);
            const {
                body: { data: accountAfter },
            } = await agent.get(`/user/${userId}/account/${accountId}`).set('authorization', authorization).send({}).expect(200);
            expect(Number((accountBefor.amount - num).toFixed(2))).toStrictEqual(accountAfter.amount);
            expect(response.body).toStrictEqual({
                data: {
                    transactionId: response.body.data.transactionId,
                },
                errors: [],
                status: 1,
            });
        });
    });
    it('should not create new transaction - miss categoryId', async () => {
        const agent = request.agent(app);

        const databaseConnection = DatabaseConnection.instance(config);
        const { userId, authorization } = await createUser({
            agent,
            databaseConnection,
        });
        userIds.push(userId);
        const response = await agent
            .post(`/user/${userId}/transaction/`)
            .set('authorization', authorization)
            .send({
                accountId: 21,
                currencyId: 1,
                transactionTypeId: 2,
                amount: 1000,
                description: 'Test',
            })
            .expect(400);

        expect(response.body).toStrictEqual({
            data: {},
            errors: [{ errorCode: 7005 }],
            status: 2,
        });
    });
    it('should not create new transaction - miss accountId', async () => {
        const agent = request.agent(app);

        const databaseConnection = DatabaseConnection.instance(config);
        const { userId, authorization } = await createUser({
            agent,
            databaseConnection,
        });
        userIds.push(userId);
        const response = await agent
            .post(`/user/${userId}/transaction/`)
            .set('authorization', authorization)
            .send({
                incomeId: 21,
                currencyId: 1,
                transactionTypeId: 2,
                amount: 1000,
                description: 'Test',
            })
            .expect(400);

        expect(response.body).toStrictEqual({
            data: {},
            errors: [{ errorCode: 7005 }],
            status: 2,
        });
    });
    it('should not create new transaction - miss categoryId and accountId', async () => {
        const agent = request.agent(app);

        const databaseConnection = DatabaseConnection.instance(config);
        const { userId, authorization } = await createUser({
            agent,
            databaseConnection,
        });
        userIds.push(userId);
        const response = await agent
            .post(`/user/${userId}/transaction/`)
            .set('authorization', authorization)
            .send({
                currencyId: 1,
                transactionTypeId: 2,
                amount: 1000,
                description: 'Test',
            })
            .expect(400);

        expect(response.body).toStrictEqual({
            data: {},
            errors: [{ errorCode: 7005 }],
            status: 2,
        });
    });
    it('should not create new transaction - miss amount', async () => {
        const agent = request.agent(app);

        const databaseConnection = DatabaseConnection.instance(config);
        const { userId, authorization } = await createUser({
            agent,
            databaseConnection,
        });
        userIds.push(userId);
        const response = await agent
            .post(`/user/${userId}/transaction/`)
            .set('authorization', authorization)
            .send({
                accountId: 5,
                categoryId: 5,
                currencyId: 1,
                transactionTypeId: 2,
                description: 'Test',
            })
            .expect(400);

        expect(response.body).toStrictEqual({
            data: {},
            errors: [{ errorCode: 7006 }],
            status: 2,
        });
    });
    it('should not create new transaction - not allow unknown properties', async () => {
        const agent = request.agent(app);

        const databaseConnection = DatabaseConnection.instance(config);
        const { userId, authorization } = await createUser({
            agent,
            databaseConnection,
        });
        const response = await agent
            .post(`/user/${userId}/transaction/`)
            .set('authorization', authorization)
            .send({
                accountId: 5,
                categoryId: 5,
                currencyId: 1,
                transactionTypeId: 1,
                amount: 1000,
                description: 'Test',
                test: 'unknown',
            })
            .expect(400);

        expect(response.body).toStrictEqual({
            data: {},
            errors: [{ errorCode: 1 }],
            status: 2,
        });
    });
});
