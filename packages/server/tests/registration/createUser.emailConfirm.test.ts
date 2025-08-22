import {
     createUserNotVerify,
    deleteUserAfterTest,
    generateRandomEmail,
    generateRandomName,
    generateRandomPassword,
    generateSecureRandom
} from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';
import { LanguageType } from 'tenpercent/shared/src/types/LanguageType';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';

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

describe('POST /register/signup/emailConfirm', () => {
    it(`verify email confirmation logic`, async () => {
        // const databaseConnection = new DatabaseConnection(config);

        const agent = request.agent(app);
        const password = generateRandomPassword();
        const email = generateRandomEmail();
        const publicName = generateRandomName();
        const { userId, authorization } = await createUserNotVerify({
            password,
            email,
            publicName,
            locale: LanguageType.US,
            agent,
        });

        for (const code of ['qwe', '123qwe', 'qeereeqq', 12345678, null, undefined]) {
            const confirmMailResponse = await agent
                .post(`/register/signup/${userId}/email-confirmation/verify`)
                .set('authorization', authorization)
                .send({ confirmationCode: code });
            expect(confirmMailResponse.status).toBe(HttpCode.BAD_REQUEST);
            console.log(confirmMailResponse.body);
        }


        expect(userId).toEqual(expect.any(Number));
    });
});
