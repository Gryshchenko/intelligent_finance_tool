import { IDatabaseConnection } from '../src/interfaces/IDatabaseConnection';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');

export function generateSecureRandom() {
    const buffer = crypto.randomBytes(4);
    return buffer.readUInt32BE(0) / (0xffffffff + 1);
}

export function generateRandomString(len = Math.floor(generateSecureRandom() * 10) + 5) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const userNameLength = len;
    let userName = 'test_';

    for (let i = 0; i < userNameLength; i++) {
        userName += chars.charAt(Math.floor(generateSecureRandom() * chars.length));
    }

    return userName;
}

export function generateRandomEmail(len = 10) {
    const domains = ['test.com', 'example.com', 'demo.com'];
    const domain = domains[Math.floor(generateSecureRandom() * domains.length)];

    return `${generateRandomString(len)}@${domain}`;
}
export function generateRandomName(len = 6) {
    return generateRandomString(len);
}

export function generateRandomPassword(len = Math.floor(generateSecureRandom() * 9) + 8) {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = lowerChars + upperChars + numbers + specialChars;
    const passwordLength = len;
    let password = '';

    password += lowerChars.charAt(Math.floor(generateSecureRandom() * lowerChars.length));
    password += upperChars.charAt(Math.floor(generateSecureRandom() * upperChars.length));
    password += numbers.charAt(Math.floor(generateSecureRandom() * numbers.length));
    password += specialChars.charAt(Math.floor(generateSecureRandom() * specialChars.length));

    for (let i = password.length; i < passwordLength; i++) {
        password += allChars.charAt(Math.floor(generateSecureRandom() * allChars.length));
    }

    password = password
        .split('')
        .sort(() => 0.5 - generateSecureRandom())
        .join('');

    return password;
}

export async function deleteUserAfterTest(id: string, db: IDatabaseConnection) {
    await db.engine()('transactions').delete().where({ userId: id });
    await db.engine()('accounts').delete().where({ userId: id });
    await db.engine()('incomes').delete().where({ userId: id });
    await db.engine()('categories').delete().where({ userId: id });
    await db.engine()('profiles').delete().where({ userId: id });
    await db.engine()('email_confirmations').delete().where({ userId: id });
    await db.engine()('usergroups').delete().where({ userId: id });
    await db.engine()('userroles').delete().where({ userId: id });
    await db.engine()('balance').delete().where({ userId: id });
    await db.engine()('users').delete().where({ userId: id });
}

// export async function signUpUser = (agent) => {
//         const user = await agent
//             .post('/register/signup')
//             .send({
//                 email: generateRandomEmail(),
//                 password: generateRandomPassword(),
//                 publicName: generateRandomName(),
//             })
//             .expect(HttpCode.OK);
//         return user;
// }
