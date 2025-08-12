import {
    deleteUserAfterTest,
    generateRandomEmail,
    generateRandomName,
    generateRandomPassword,
    generateSecureRandom,
} from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';
import { TransactionType } from '../../src/types/TransactionType';
import { AccountStatusType } from 'tenpercent/shared/src/types/AccountStatusType';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const app = require('../../src/app');

let server: unknown;

let userIds: string[] = [];

beforeAll(() => {
    const port = Math.floor(generateSecureRandom() * (65535 - 1024) + 1024);

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

describe('Income', () => {
    it(`POST - create income`, async () => {
        const agent = request.agent(app);

        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword(), publicName: generateRandomName() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        for (const { name } of [{ name: 'Test 1' }, { name: 'Test 2' }, { name: 'Test 3' }]) {
            const {
                body: {
                    data: { incomeId, incomeName },
                },
            } = await agent
                .post(`/user/${create_user.body.data.userId}/income/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    currencyId: 1,
                    incomeName: name,
                })
                .expect(200);
            expect(incomeId).toBeTruthy();
            expect(incomeName).toStrictEqual(name);
        }
        for (const data of [
            {
                incomeName: 'Test 1',
            },
            {
                currencyId: 1,
            },
            {},
            {
                currencyId: '23',
                incomeName: 123123,
            },
            {
                currencyId: 1,
                incomeName:
                    'sdfsdfsdkjfdskfjhdsfkdsfhsdkfjhdsfkjdshfkdsfhdskfjhdskfjdshfdsjkfhdskjfhdsjkhfjkdshfjkhsdfjkdsjhfdjksfdshfjkdsfhdskfjhdsjkfjhdsfhkj',
            },
        ]) {
            await agent
                .post(`/user/${create_user.body.data.userId}/income/`)
                .set('authorization', create_user.header['authorization'])
                .send(data)
                .expect(400);
        }
    });
    it(`PATCH - update income`, async () => {
        const agent = request.agent(app);

        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword(), publicName: generateRandomName() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        const obj = [
            { name: 'Test 1', id: null },
            { name: 'Test 2', id: null },
            { name: 'Test 3', id: null },
        ];
        let i = 0;
        for (const { name } of obj) {
            const {
                body: {
                    data: { incomeId, incomeName },
                },
            } = await agent
                .post(`/user/${create_user.body.data.userId}/income/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    currencyId: 1,
                    incomeName: name,
                })
                .expect(200);
            expect(incomeId).toBeTruthy();
            expect(incomeName).toStrictEqual(name);
            obj[i]['id'] = incomeId;
            i += 1;
        }

        for (const { name, id } of obj) {
            await agent
                .patch(`/user/${create_user.body.data.userId}/income/${id}`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    incomeName: `${name}${id}`,
                })
                .expect(204);
            const {
                body: {
                    data: { incomeId, incomeName },
                },
            } = await agent
                .get(`/user/${create_user.body.data.userId}/income/${id}`)
                .set('authorization', create_user.header['authorization'])
                .expect(200);

            expect(incomeId).toStrictEqual(id);
            expect(incomeName).toStrictEqual(`${name}${id}`);
        }
        for (const id of [999999999, 23129831, 238231]) {
            await agent
                .patch(`/user/${create_user.body.data.userId}/income/${id}`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    incomeName: `any`,
                })
                .expect(404);
        }
        for (const id of ['sdsd', null, undefined, -1]) {
            await agent
                .patch(`/user/${create_user.body.data.userId}/income/${id}`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    incomeName: `any`,
                })
                .expect(400);
        }
        await agent
            .patch(`/user/${create_user.body.data.userId}/income/${obj[0].id}`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
    });
    it(`unknown properties`, async () => {
        const agent = request.agent(app);

        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword(), publicName: generateRandomName() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        await agent
            .post(`/user/${create_user.body.data.userId}/income/`)
            .set('authorization', create_user.header['authorization'])
            .send({
                currencyId: 1,
                incomeName: 'Test',
                something: 200,
            })
            .expect(400);
        await agent
            .post(`/user/${create_user.body.data.userId}/income/`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
        await agent
            .post(`/user/${create_user.body.data.userId}/income/?something=200`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
        await agent
            .get(`/user/${create_user.body.data.userId}/income/${21}`)
            .set('authorization', create_user.header['authorization'])
            .send({
                something: 200,
            })
            .expect(404);
        await agent
            .get(`/user/${create_user.body.data.userId}/income/${21}?something=200`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
    });
    it(`DELETE - delete income`, async () => {
        const agent = request.agent(app);
        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword(), publicName: generateRandomName() })
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

        const {
            body: {
                data: { incomeId },
            },
        } = await agent
            .post(`/user/${create_user.body.data.userId}/income/`)
            .set('authorization', create_user.header['authorization'])
            .send({
                currencyId: 1,
                incomeName: 'Test 1',
            })
            .expect(200);
        const transactions = [
            {
                transactionTypeId: TransactionType.Income,
                incomeId,
                amount: 1000,
                accountId: accounts[0].accountId,
            },
            {
                transactionTypeId: TransactionType.Income,
                incomeId,
                amount: 1000,
                accountId: accounts[0].accountId,
            },
            {
                transactionTypeId: TransactionType.Income,
                incomeId,
                amount: 1000,
                accountId: accounts[0].accountId,
            },
        ];

        const ids = [];

        for (const transaction of transactions) {
            const {
                body: {
                    data: { transactionId },
                },
            } = await agent
                .post(`/user/${create_user.body.data.userId}/transaction/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    currencyId: 1,
                    description: 'Test',
                    ...transaction,
                    incomeId,
                })
                .expect(201);
            ids.push(transactionId);
        }
        await agent
            .get(`/user/${create_user.body.data.userId}/income/${incomeId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(200);
        await agent
            .patch(`/user/${create_user.body.data.userId}/income/${incomeId}`)
            .set('authorization', create_user.header['authorization'])
            .send({
                status: AccountStatusType.Disable,
            })
            .expect(204);
        for (const id of ids) {
            await agent
                .get(`/user/${create_user.body.data.userId}/transaction/${id}`)
                .set('authorization', create_user.header['authorization'])
                .expect(200);
        }
        for (const id of ids) {
            await agent
                .delete(`/user/${create_user.body.data.userId}/transaction/${id}`)
                .set('authorization', create_user.header['authorization'])
                .expect(204);
        }
        await agent
            .delete(`/user/${create_user.body.data.userId}/income/${incomeId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(204);
        for (const id of ids) {
            await agent
                .get(`/user/${create_user.body.data.userId}/transaction/${id}`)
                .set('authorization', create_user.header['authorization'])
                .expect(404);
        }
        await agent
            .delete(`/user/${create_user.body.data.userId}/income/99999999}`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
    });
});
