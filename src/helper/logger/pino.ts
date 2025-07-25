import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const baseLogger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: isDev
        ? {
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
              },
          }
        : undefined,
});
