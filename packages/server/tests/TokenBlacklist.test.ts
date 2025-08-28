import { KeyValueStore } from '../src/repositories/keyValueStore/KeyValueStore';
import { TokenBlacklist } from '../src/services/auth/TokenBlacklist';
import { CustomError } from '../src/utils/errors/CustomError';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwt = require('jsonwebtoken');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');

jest.mock('../src/repositories/keyValueStore/KeyValueStore');

describe('TokenBlacklist (full coverage)', () => {
    let storeMock: jest.Mocked<KeyValueStore>;
    let blacklist: TokenBlacklist;

    beforeEach(() => {
        storeMock = {
            set: jest.fn(),
            exists: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<KeyValueStore>;

        (TokenBlacklist as any)._instance = undefined;
        blacklist = TokenBlacklist.instance(storeMock);
    });

    const generateToken = (expOffsetSeconds?: number) => {
        const payload: any = { sub: 'user1' };
        if (expOffsetSeconds !== undefined) {
            payload.exp = Math.floor(Date.now() / 1000) + expOffsetSeconds;
        }
        return jwt.sign(payload, 'secret');
    };

    it('singleton: should return the same instance', () => {
        const another = TokenBlacklist.instance(storeMock);
        expect(blacklist).toBe(another);
    });

    it('should add token to blacklist if TTL > 0', async () => {
        const token = generateToken(60);

        await blacklist.blacklistToken(token);

        const hash = crypto.createHash('sha256').update(token).digest('hex');
        const expectedKey = `blacklist:${hash}`;

        expect(storeMock.set).toHaveBeenCalledWith(expectedKey, true, expect.any(Number));
    });

    it('should NOT add token to blacklist if TTL <= 0', async () => {
        const token = generateToken(-10);

        await blacklist.blacklistToken(token);

        expect(storeMock.set).not.toHaveBeenCalled();
    });

    it('should throw error if token has no exp', async () => {
        const token = generateToken();

        await expect(blacklist.blacklistToken(token)).rejects.toThrow(CustomError);
    });

    it('isBlacklisted should return true if exists', async () => {
        const token = generateToken(60);
        storeMock.exists.mockResolvedValueOnce(true);

        const result = await blacklist.isBlacklisted(token);

        const hash = crypto.createHash('sha256').update(token).digest('hex');
        const expectedKey = `blacklist:${hash}`;
        expect(storeMock.exists).toHaveBeenCalledWith(expectedKey);
        expect(result).toBe(true);
    });

    it('isBlacklisted should return false if not exists', async () => {
        const token = generateToken(60);
        storeMock.exists.mockResolvedValueOnce(false);

        const result = await blacklist.isBlacklisted(token);
        expect(result).toBe(false);
    });

    it('keyFor should consistently hash token', () => {
        const token = generateToken(60);
        const key1 = (blacklist as any).keyFor(token);
        const key2 = (blacklist as any).keyFor(token);

        expect(key1).toBe(key2);
        expect(key1).toMatch(/^blacklist:[a-f0-9]{64}$/);
    });
});
