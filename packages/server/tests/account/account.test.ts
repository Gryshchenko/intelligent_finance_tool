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

describe('Account', () => {
    it(`POST - create account`, async () => {
        const agent = request.agent(app);

        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword(), publicName: generateRandomName() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        for (const { amount: newAmount, name } of [
            { amount: 100, name: 'Test 1' },
            { amount: -100, name: 'Test 2' },
            { amount: 0, name: 'Test 3' },
        ]) {
            const {
                body: {
                    data: { accountId, amount, accountName },
                },
            } = await agent
                .post(`/user/${create_user.body.data.userId}/account/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    currencyId: 1,
                    accountName: name,
                    amount: newAmount,
                })
                .expect(200);
            expect(accountId).toBeTruthy();
            expect(Number(amount)).toStrictEqual(newAmount);
            expect(accountName).toStrictEqual(name);
        }
        for (const data of [
            {
                accountName: 'Test 1',
                amount: 1,
            },
            {
                currencyId: 1,
                accountName: 'Test 1',
            },
            {
                currencyId: 1,
                amount: 1,
            },
            {},
            {
                currencyId: '23',
                amount: '213',
                accountName: 123123,
            },
            {
                currencyId: 1,
                amount: 1231231231231231231231231232131231,
                accountName:
                    'sdfsdfsdkjfdskfjhdsfkdsfhsdkfjhdsfkjdshfkdsfhdskfjhdskfjdshfdsjkfhdskjfhdsjkhfjkdshfjkhsdfjkdsjhfdjksfdshfjkdsfhdskfjhdsjkfjhdsfhkj',
            },
        ]) {
            await agent
                .post(`/user/${create_user.body.data.userId}/account/`)
                .set('authorization', create_user.header['authorization'])
                .send(data)
                .expect(400);
        }
    });
    it(`PATCH - update account`, async () => {
        const agent = request.agent(app);

        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword(), publicName: generateRandomName() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        const obj = [
            { amount: 100, name: 'Test 1', id: null },
            { amount: -100, name: 'Test 2', id: null },
            { amount: 0, name: 'Test 3', id: null },
        ];
        let i = 0;
        for (const { amount: newAmount, name } of obj) {
            const {
                body: {
                    data: { accountId, amount, accountName },
                },
            } = await agent
                .post(`/user/${create_user.body.data.userId}/account/`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    currencyId: 1,
                    accountName: name,
                    amount: newAmount,
                })
                .expect(200);
            expect(accountId).toBeTruthy();
            expect(Number(amount)).toStrictEqual(newAmount);
            expect(accountName).toStrictEqual(name);
            obj[i]['id'] = accountId;
            i += 1;
        }

        for (const { amount: newAmount, name, id } of obj) {
            await agent
                .patch(`/user/${create_user.body.data.userId}/account/${id}`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    accountName: `${name}${id}`,
                    amount: newAmount + 1000,
                })
                .expect(204);
            const {
                body: {
                    data: { accountId, amount, accountName },
                },
            } = await agent
                .get(`/user/${create_user.body.data.userId}/account/${id}`)
                .set('authorization', create_user.header['authorization'])
                .expect(200);

            expect(accountId).toStrictEqual(id);
            expect(Number(amount)).toStrictEqual(newAmount + 1000);
            expect(accountName).toStrictEqual(`${name}${id}`);
        }
        for (const id of [999999999, 23129831, 238231]) {
            await agent
                .patch(`/user/${create_user.body.data.userId}/account/${id}`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    accountName: `any`,
                    amount: 1000,
                })
                .expect(404);
        }
        for (const id of ['sdsd', null, undefined, -1]) {
            await agent
                .patch(`/user/${create_user.body.data.userId}/account/${id}`)
                .set('authorization', create_user.header['authorization'])
                .send({
                    accountName: `any`,
                    amount: 1000,
                })
                .expect(400);
        }
        await agent
            .patch(`/user/${create_user.body.data.userId}/account/${obj[0].id}`)
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
            .post(`/user/${create_user.body.data.userId}/account/`)
            .set('authorization', create_user.header['authorization'])
            .send({
                currencyId: 1,
                accountName: 'Test',
                amount: 10,
                something: 200,
            })
            .expect(400);
        await agent
            .post(`/user/${create_user.body.data.userId}/account/`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
        await agent
            .post(`/user/${create_user.body.data.userId}/account/?something=200`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
        await agent
            .get(`/user/${create_user.body.data.userId}/account/${21}`)
            .set('authorization', create_user.header['authorization'])
            .send({
                something: 200,
            })
            .expect(404);
        await agent
            .get(`/user/${create_user.body.data.userId}/account/${21}?something=200`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
    });
    it(`DELETE - delete account - hide`, async () => {
        const agent = request.agent(app);
        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword(), publicName: generateRandomName() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        const {
            body: {
                data: { incomes, categories, accounts },
            },
        } = await agent
            .get(`/user/${create_user.body.data.userId}/overview/`)
            .set('authorization', create_user.header['authorization'])
            .send({})
            .expect(200);

        const incomeId = incomes[0].incomeId;
        const categoryId = categories[0].categoryId;
        const targetAccountId = accounts[0].accountId;
        const {
            body: {
                data: { accountId },
            },
        } = await agent
            .post(`/user/${create_user.body.data.userId}/account/`)
            .set('authorization', create_user.header['authorization'])
            .send({
                currencyId: 1,
                accountName: 'Test 1',
                amount: 20000,
            })
            .expect(200);
        const transactions = [
            {
                transactionTypeId: TransactionType.Income,
                incomeId,
            },
            {
                transactionTypeId: TransactionType.Expense,
                categoryId,
            },
            {
                transactionTypeId: TransactionType.Transafer,
                targetAccountId,
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
                    accountId,
                    currencyId: 1,
                    amount: 1000,
                    description: 'Test',
                    ...transaction,
                })
                .expect(201);
            ids.push(transactionId);
        }
        await agent
            .get(`/user/${create_user.body.data.userId}/account/${accountId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(200);
        await agent
            .patch(`/user/${create_user.body.data.userId}/account/${accountId}`)
            .set('authorization', create_user.header['authorization'])
            .send({
                status: AccountStatusType.Disable,
            })
            .expect(204);
        await agent
            .get(`/user/${create_user.body.data.userId}/account/${accountId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(404);
        for (const id of ids) {
            await agent
                .get(`/user/${create_user.body.data.userId}/transaction/${id}`)
                .set('authorization', create_user.header['authorization'])
                .expect(200);
        }
    });
    it(`DELETE - delete account - full`, async () => {
        const agent = request.agent(app);
        const create_user = await agent
            .post('/register/signup')
            .send({ email: generateRandomEmail(5), password: generateRandomPassword(), publicName: generateRandomName() })
            .expect(200);

        userIds.push(create_user.body.data.userId);
        const {
            body: {
                data: { incomes, categories, accounts },
            },
        } = await agent
            .get(`/user/${create_user.body.data.userId}/overview/`)
            .set('authorization', create_user.header['authorization'])
            .send({})
            .expect(200);

        const incomeId = incomes[0].incomeId;
        const categoryId = categories[0].categoryId;
        const targetAccountId = accounts[0].accountId;
        const {
            body: {
                data: { accountId },
            },
        } = await agent
            .post(`/user/${create_user.body.data.userId}/account/`)
            .set('authorization', create_user.header['authorization'])
            .send({
                currencyId: 1,
                accountName: 'Test 1',
                amount: 20000,
            })
            .expect(200);
        const transactions = [
            {
                transactionTypeId: TransactionType.Income,
                incomeId,
            },
            {
                transactionTypeId: TransactionType.Expense,
                categoryId,
            },
            {
                transactionTypeId: TransactionType.Transafer,
                targetAccountId,
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
                    accountId,
                    currencyId: 1,
                    amount: 1000,
                    description: 'Test',
                    ...transaction,
                })
                .expect(201);
            ids.push(transactionId);
        }
        await agent
            .get(`/user/${create_user.body.data.userId}/account/${accountId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(200);
        for (const id of ids) {
            await agent
                .get(`/user/${create_user.body.data.userId}/transaction/${id}`)
                .set('authorization', create_user.header['authorization'])
                .expect(200);
        }
        await agent
            .delete(`/user/${create_user.body.data.userId}/account/${accountId}`)
            .set('authorization', create_user.header['authorization'])
            .expect(204);
        for (const id of ids) {
            await agent
                .get(`/user/${create_user.body.data.userId}/transaction/${id}`)
                .set('authorization', create_user.header['authorization'])
                .expect(404);
        }
        await agent
            .delete(`/user/${create_user.body.data.userId}/account/99999999}`)
            .set('authorization', create_user.header['authorization'])
            .expect(400);
    });
});
