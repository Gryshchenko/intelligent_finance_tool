import { generateRandomEmail, generateRandomName, generateRandomPassword, generateSecureRandom } from '../TestsUtils.';
import DatabaseConnection from '../../src/repositories/DatabaseConnection';
import config from '../../src/config/dbConfig';

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
jest.mock('../../src/services/userRole/UserRoleService', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return {
                createRole: jest.fn().mockImplementation(() => Promise.reject(new Error('cant create role'))),
            };
        }),
    };
});

describe('transaction POST /register/signup', () => {
    it('check DB transaction on crash createRole', async () => {
        const mail = generateRandomEmail();
        const pass = generateRandomPassword();
        const publicName = generateRandomName();
        const response = await request(app).post('/register/signup').send({ email: mail, password: pass, publicName });

        const databaseConnection = new DatabaseConnection(config);
        const data = await databaseConnection.engine()('users').select('*').where({ email: mail });
        expect(data).toStrictEqual([]);
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({
            data: {},
            errors: [
                {
                    errorCode: 5001,
                },
            ],
            status: 2,
        });
    });
});
