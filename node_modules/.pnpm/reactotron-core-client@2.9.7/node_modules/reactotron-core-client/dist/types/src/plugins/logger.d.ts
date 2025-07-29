import type { ReactotronCore } from "../reactotron-core-client";
/**
 * Provides 4 features for logging.  log & debug are the same.
 */
declare const logger: () => (reactotron: ReactotronCore) => {
    features: {
        log: (...args: any[]) => void;
        logImportant: (...args: any[]) => void;
        debug: (message: any, important?: any) => void;
        warn: (message: any) => void;
        error: (message: any, stack: any) => void;
    };
};
export default logger;
export type LoggerPlugin = ReturnType<typeof logger>;
export declare const hasLoggerPlugin: (reactotron: ReactotronCore) => reactotron is ReactotronCore & {
    log: (...args: any[]) => void;
    logImportant: (...args: any[]) => void;
    debug: (message: any, important?: any) => void;
    warn: (message: any) => void;
    error: (message: any, stack: any) => void;
};
export declare const assertHasLoggerPlugin: (reactotron: ReactotronCore) => asserts reactotron is ReactotronCore & {
    log: (...args: any[]) => void;
    logImportant: (...args: any[]) => void;
    debug: (message: any, important?: any) => void;
    warn: (message: any) => void;
    error: (message: any, stack: any) => void;
};
