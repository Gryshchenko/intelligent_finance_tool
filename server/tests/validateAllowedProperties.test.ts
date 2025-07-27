import { validateAllowedProperties } from '../src/utils/validation/validateAllowedProperties';

describe('validateAllowedProperties', () => {
    test('should not throw an error for a valid object', () => {
        const obj = { name: 'Alice', age: 25 };
        const allowedKeys = ['name', 'age', 'email'];

        expect(() => validateAllowedProperties(obj, allowedKeys)).not.toThrow();
    });

    test('should throw an error for an object with invalid properties', () => {
        const obj = { name: 'Alice', age: 25, extraProp: 'not allowed' };
        const allowedKeys = ['name', 'age', 'email'];

        expect(() => validateAllowedProperties(obj, allowedKeys)).toThrowError('Invalid properties detected: extraProp');
    });

    test('should not throw an error for an empty object', () => {
        const obj = {};
        const allowedKeys = ['name', 'age', 'email'];

        expect(() => validateAllowedProperties(obj, allowedKeys)).not.toThrow();
    });
});
