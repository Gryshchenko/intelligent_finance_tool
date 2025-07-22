import { baseLogger } from 'helper/logger/pino';
import Logger from '../src/helper/logger/Logger';

jest.mock('helper/logger/pino', () => ({
    baseLogger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));

describe('Logger', () => {
    const moduleName = 'TestModule';
    const context = { requestId: '123', userId: '456' };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log info with message and context', () => {
        const logger = Logger.Of(moduleName, context);
        logger.info('Info message', { custom: 'value' });

        expect(baseLogger.info).toHaveBeenCalledWith(
            expect.objectContaining({
                module: moduleName,
                requestId: '123',
                userId: '456',
                custom: 'value',
            }),
            'Info message'
        );
    });

    it('should log warn with message only', () => {
        const logger = Logger.Of(moduleName, context);
        logger.warn('Warn message');

        expect(baseLogger.warn).toHaveBeenCalledWith(
            expect.objectContaining({
                module: moduleName,
                requestId: '123',
                userId: '456',
            }),
            'Warn message'
        );
    });

    it('should log error with message and non-object data', () => {
        const logger = Logger.Of(moduleName, context);
        logger.error('Error message', 'just a string');

        expect(baseLogger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                module: moduleName,
                requestId: '123',
                userId: '456',
            }),
            'Error message'
        );
    });

    it('should log debug with empty context', () => {
        const logger = Logger.Of(moduleName);
        logger.debug('Debug message');

        expect(baseLogger.debug).toHaveBeenCalledWith(
            expect.objectContaining({
                module: moduleName,
            }),
            'Debug message'
        );
    });
});
