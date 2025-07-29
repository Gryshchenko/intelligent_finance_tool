import type { ReactotronCore } from "../reactotron-core-client";
/**
 * Runs small high-unscientific benchmarks for you.
 */
declare const benchmark: () => (reactotron: ReactotronCore) => {
    features: {
        benchmark: (title: string) => {
            step: (stepTitle: string) => void;
            stop: (stopTitle: string) => void;
            last: (stopTitle: string) => void;
        };
    };
};
export default benchmark;
