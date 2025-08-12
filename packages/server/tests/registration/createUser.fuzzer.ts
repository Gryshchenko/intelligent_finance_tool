import { generateSecureRandom } from '../TestsUtils.';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const axios = require('axios');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const httpsAgent = new (require('https').Agent)({
    rejectUnauthorized: false,
});
const url = 'https://localhost:3000/register/signup';

function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(generateSecureRandom() * charactersLength));
    }
    return result;
}

async function fuzzSignup() {
    const testData = {
        email: generateRandomString(10) + '@test.com',
        password: generateRandomString(Math.floor(generateSecureRandom() * 26) + 5),
        locale: generateSecureRandom() > 0.5 ? generateRandomString(5) : undefined,
    };

    try {
        const response = await axios.post(url, testData, {
            httpsAgent: httpsAgent,
        });
        console.log('Response:', response.data);
    } catch (error) {
        // @ts-expect-error is necessary
        console.error('Error:', error.response ? error.response.data : error.message);
        fs.appendFileSync('./fuzz_errors.log', JSON.stringify(testData) + '\n');
    }
}

for (let i = 0; i < 100; i++) {
    fuzzSignup();
}
