import { generateRandomEmail, generateRandomName, generateRandomPassword, generateSecureRandom } from '../TestsUtils.';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const app = require('../../src/app');

jest.mock('argon2', () => ({
    hash: jest.fn().mockRejectedValue(new Error('Mocked failure')),
}));

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

describe('POST /register/signup', () => {
    it('argon2 crashed: should return error', async () => {
        const response = await request(app)
            .post('/register/signup')
            .send({ email: generateRandomEmail(), password: generateRandomPassword(), publicName: generateRandomName() });

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
