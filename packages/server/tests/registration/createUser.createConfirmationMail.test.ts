import { generateRandomEmail, generateRandomName, generateRandomPassword, generateSecureRandom } from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const app = require('../../src/app');

let server: never;

beforeAll(() => {
    const port = Math.floor(generateSecureRandom() * (65535 - 1024) + 1024);

    // @ts-expect-error is necessary
    server = app.listen(port);
});

afterAll((done) => {
    // @ts-expect-error is necessary
    server.close(done);
});
afterEach(() => {
    jest.restoreAllMocks();
});

describe('transaction POST /register/signup', () => {
    it('check DB transaction on crash createConfirmationMail', async () => {
        const mail = generateRandomEmail();
        const pass = generateRandomPassword();
        const publicName = generateRandomName();
        const response = await request(app).post('/register/signup').send({ email: mail, password: pass, publicName });

        const databaseConnection = new DatabaseConnection(config);
        const data = await databaseConnection.engine()('users').select('*').where({ email: mail });
        expect(data).toStrictEqual([]);
        expect(response.status).toBe(HttpCode.INTERNAL_SERVER_ERROR);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: ErrorCode.SIGNUP_CATCH_ERROR,
                },
            ],
            status: ResponseStatusType.INTERNAL,
        });
    });
});
