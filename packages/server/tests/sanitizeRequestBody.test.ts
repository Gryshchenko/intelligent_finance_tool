import { sanitizeRequestBody } from '../src/utils/validation/sanitizeRequestBody';
import { HttpCode } from '../src/types/HttpCode';
import { ResponseStatusType } from '../src/types/ResponseStatusType';
import { ErrorCode } from '../src/types/ErrorCode';

describe('sanitizeRequestBody function', () => {
    const allowedFields = ['name', 'email'];

    it('should pass if body contains only allowed fields', () => {
        const req = { body: { name: 'John', email: 'john@example.com' } } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();

        sanitizeRequestBody(allowedFields)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request with unexpected fields', () => {
        const req = { body: { name: 'John', email: 'john@example.com', age: 30 } } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();

        sanitizeRequestBody(allowedFields)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpCode.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            status: ResponseStatusType.INTERNAL,
            data: {},
            errors: [{ errorCode: ErrorCode.UNEXPECTED_PROPERTY }],
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should pass if request body is empty', () => {
        const req = { body: {} } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();

        sanitizeRequestBody(allowedFields)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle multiple unexpected fields correctly', () => {
        const req = { body: { name: 'John', email: 'john@example.com', age: 30, city: 'NY' } } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();

        sanitizeRequestBody(allowedFields)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HttpCode.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            status: ResponseStatusType.INTERNAL,
            data: {},
            errors: [{ errorCode: ErrorCode.UNEXPECTED_PROPERTY }],
        });
        expect(next).not.toHaveBeenCalled();
    });
});
