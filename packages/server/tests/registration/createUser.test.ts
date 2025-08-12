import {
    deleteUserAfterTest,
    generateRandomEmail,
    generateRandomName,
    generateRandomPassword,
    generateRandomString,
    generateSecureRandom,
} from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';
import { user_initial } from '../../src/config/user_initial';
import currency_initial from '../../src/config/currency_initial';
import { LanguageType } from 'tenpercent/shared/src/types/LanguageType';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const argon2 = require('argon2');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const app = require('../../src/app');

let server: never;

const userIds: string[] = [];

beforeAll(() => {
    const port = Math.floor(generateSecureRandom() * (65535 - 1024) + 1024);

    // @ts-expect-error is necessary
    server = app.listen(port);
});

afterAll((done) => {
    userIds.forEach((id) => {
        deleteUserAfterTest(id, DatabaseConnection.instance(config));
    });
    // @ts-expect-error is necessary
    server.close(done);
});

describe('POST /register/signup', () => {
    it('should return error for invalid locale format', async () => {
        const response = await request(app).post('/register/signup').send({
            email: generateRandomEmail(),
            password: generateRandomPassword(),
            locale: 213123,
            publicName: generateRandomName(),
        });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4010,
                },
            ],
            status: 2,
        });
    });
    it('should return error for invalid email format to big', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: generateRandomEmail(31), password: generateRandomPassword(), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4000,
                },
            ],
            status: 2,
        });
    });
    it('should return error for invalid email format', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: 'invalid-email', password: generateRandomPassword(), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4000,
                },
            ],
            status: 2,
        });
    });
    it('should return error for invalid email format', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: 'example.com', password: generateRandomPassword(), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4000,
                },
            ],
            status: 2,
        });
    });
    it('should return error for invalid email format', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: 'example@', password: generateRandomPassword(), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4000,
                },
            ],
            status: 2,
        });
    });
    it('should return error for invalid email format', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: 'example@test@com', password: generateRandomPassword(), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4000,
                },
            ],
            status: 2,
        });
    });
    it('should return error for invalid email format', async () => {
        const publicName = generateRandomName();
        const response = await request(app)
            .post('/register/signup')
            .send({ email: null, password: generateRandomPassword(), publicName });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4000,
                },
            ],
            status: 2,
        });
    });
    it('should return error for too short password', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: 'test_test@gmail.com', password: generateRandomPassword(5), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4002,
                },
            ],
            status: 2,
        });
    });
    it('should return error for too big password', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: generateRandomEmail(), password: generateRandomPassword(31), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4002,
                },
            ],
            status: 2,
        });
    });
    it('should return error invalid format password', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: 'google_test1@test.com', password: generateSecureRandom(), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4002,
                },
            ],
            status: 2,
        });
    });
    it('should return error invalid format password', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: 'google_test2@test.com', password: generateRandomString(5), publicName: generateRandomName() });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4002,
                },
            ],
            status: 2,
        });
    });
    it('should return error invalid format password', async () => {
        const publicName = generateRandomName();
        const response = await request(app)
            .post('/register/signup')
            .send({ email: 'google_test3@test.com', password: null, publicName });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 4002,
                },
                {
                    errorCode: 4002,
                },
            ],
            status: 2,
        });
    });
    it('should hash the password before saving to database', async () => {
        const spy = jest.spyOn(argon2, 'hash');
        const mail = generateRandomEmail();
        const publicName = generateRandomName();
        const response = await request(app)
            .post('/register/signup')
            .send({ email: mail, password: generateRandomPassword(), publicName });

        userIds.push(response.body.data.userId);
        expect(response.body).toStrictEqual({
            status: 1,
            data: {
                email: mail,
                status: 1,
                userId: expect.any(Number),
                currency: { currencyCode: 'USD', currencyName: 'US Dollar', symbol: '$' },
                profile: { locale: 'en-US' },
                additionalInfo: null,
            },
            errors: [],
        });
        expect(spy).toHaveBeenCalled();
    });
    it('should failed email already exist', async () => {
        const mail = generateRandomEmail();
        const publicName = generateRandomName();
        const {
            body: {
                data: { userId },
            },
        } = await request(app).post('/register/signup').send({ email: mail, password: generateRandomPassword(), publicName });
        const response = await request(app)
            .post('/register/signup')
            .send({ email: mail, password: generateRandomPassword(), publicName });
        userIds.push(userId);
        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 5003,
                },
            ],
            status: 2,
        });
    });

    const testCases = ['aa-AA'];
    testCases.forEach((locale) => {
        it(`check users accounts, incomes, category for locale: ${locale}`, async () => {
            const mail = generateRandomEmail();

            const initialData = user_initial[locale as LanguageType] ?? user_initial[LanguageType.US];
            const initialCurrency = currency_initial[locale as LanguageType] ?? currency_initial[LanguageType.US];
            const pass = generateRandomPassword();
            const publicName = generateRandomName();
            const response = await request(app)
                .post('/register/signup')
                .send({ email: mail, password: pass, locale, publicName });
            const databaseConnection = new DatabaseConnection(config);
            const user = await databaseConnection.engine()('users').select('*').where({ email: mail }).first();
            const confirmMail = await databaseConnection
                .engine()('email_confirmations')
                .select('*')
                .where({ email: mail, userId: user.userId });
            const accounts = await databaseConnection.engine()('accounts').select('*').where({ userId: user.userId });
            const categories = await databaseConnection.engine()('categories').select('*').where({ userId: user.userId });
            const incomes = await databaseConnection.engine()('incomes').select('*').where({ userId: user.userId });
            const balance = await databaseConnection.engine()('balance').select('*').where({ userId: user.userId });

            expect(balance.length).toBe(1);
            expect(balance[0].userId).toBe(user.userId);
            expect(balance[0].balance).toBe('0');
            userIds.push(user.userId);
            expect(confirmMail.length).toBe(1);
            expect(confirmMail[0].email).toEqual(mail);
            expect(
                accounts.map((data) => ({
                    userId: data.userId,
                    accountName: data.accountName,
                    amount: data.amount,
                })),
            ).toEqual(
                initialData.accounts.map((data: unknown) => ({
                    userId: user.userId,
                    accountName: data,
                    amount: '0',
                })),
            );
            expect(
                categories.map((data) => ({
                    categoryName: data.categoryName,
                    userId: data.userId,
                })),
            ).toEqual(
                initialData.categories.map((data: unknown) => ({
                    categoryName: data,
                    userId: user.userId,
                })),
            );
            expect(
                incomes.map((data) => ({
                    userId: data.userId,
                    incomeName: data.incomeName,
                })),
            ).toEqual(
                initialData.income.map((data: unknown) => ({
                    userId: user.userId,
                    incomeName: data,
                })),
            );

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual({
                status: 1,
                data: {
                    email: mail,
                    status: 1,
                    userId: expect.any(Number),
                    currency: initialCurrency,
                    profile: { locale: locale === 'aa-AA' ? LanguageType.US : locale },
                    additionalInfo: null,
                },
                errors: [],
            });
        });
    });
});
