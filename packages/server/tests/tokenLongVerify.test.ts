import jwt from 'jsonwebtoken';
import { getConfig } from '../src/config/config';
import { tokenLongVerify } from '../src/middleware/tokenVerify';
import { HttpCode } from 'tenpercent/shared/src/types/HttpCode';
import { ErrorCode } from 'tenpercent/shared/src/types/ErrorCode';
import { ResponseStatusType } from 'tenpercent/shared/src/types/ResponseStatusType';

jest.mock('../src/config/config', () => ({
    getConfig: () => ({
        jwtLongSecret: 'test_secret',
        jwtAlgorithm: 'HS256',
        jwtIssuer: 'my-service',
        jwtAudience: 'my-clients',
    }),
}));

const mockReq = (token?: string, userId = '123') =>
    ({
        body: token ? { token } : {},
        user: { userId },
        params: {
            userId,
        },
    }) as any;

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = () => jest.fn();

describe('tokenLongVerify (unit)', () => {
    const config = getConfig();

    const validToken = jwt.sign({}, config.jwtLongSecret, {
        algorithm: config.jwtAlgorithm as jwt.Algorithm,
        issuer: config.jwtIssuer,
        audience: config.jwtAudience,
        expiresIn: '1h',
        subject: '123',
    });

    it('calls next() on valid token', () => {
        const req = mockReq(validToken);
        const res = mockRes();
        const next = mockNext();

        tokenLongVerify(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it(' returns 400 if token is missing', () => {
        const req = mockReq(undefined);
        const res = mockRes();
        const next = mockNext();

        tokenLongVerify(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpCode.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            data: {},
            errors: [{ errorCode: ErrorCode.TOKEN_LONG_INVALID_ERROR, payload: undefined }],
            status: ResponseStatusType.INTERNAL,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 if token length is too short', () => {
        const req = mockReq('abc');
        const res = mockRes();
        const next = mockNext();

        tokenLongVerify(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpCode.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 if secret is wrong', () => {
        const badToken = jwt.sign({}, 'wrong_secret', {
            algorithm: 'HS256',
            issuer: config.jwtIssuer,
            audience: config.jwtAudience,
            expiresIn: '1h',
            subject: '123',
        });

        const req = mockReq(badToken);
        const res = mockRes();
        const next = mockNext();

        tokenLongVerify(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpCode.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });

    it(' returns 400 if sub does not match userId', () => {
        const badToken = jwt.sign({}, config.jwtLongSecret, {
            algorithm: 'HS256',
            issuer: config.jwtIssuer,
            audience: config.jwtAudience,
            expiresIn: '1h',
            subject: '999',
        });

        const req = mockReq(badToken, '123');
        const res = mockRes();
        const next = mockNext();

        tokenLongVerify(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpCode.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });

    // it(' returns 401 if token is expired', () => {
    //     const expiredToken = jwt.sign({}, config.jwtLongSecret, {
    //         algorithm: config.jwtAlgorithm as jwt.Algorithm,
    //         issuer: config.jwtIssuer,
    //         audience: config.jwtAudience,
    //         expiresIn: '-10s',
    //         subject: '123',
    //     });
    //
    //     const req = mockReq(expiredToken);
    //     const res = mockRes();
    //     const next = mockNext();
    //
    //     tokenLongVerify(req, res, next);
    //
    //     expect(res.status).toHaveBeenCalledWith(HttpCode.BAD_REQUEST);
    //     expect(res.json).toHaveBeenCalledWith({
    //         data: {},
    //         errors: [{ errorCode: ErrorCode.TOKEN_LONG_INVALID_ERROR, payload: undefined }],
    //         status: ResponseStatusType.INTERNAL,
    //     });
    //     expect(next).not.toHaveBeenCalled();
    // });
});
