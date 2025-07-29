import type { ReactotronCore } from "../reactotron-core-client";
/**
 * Clears the reactotron server.
 */
declare const clear: () => (reactotron: ReactotronCore) => {
    features: {
        clear: () => void;
    };
};
export default clear;
