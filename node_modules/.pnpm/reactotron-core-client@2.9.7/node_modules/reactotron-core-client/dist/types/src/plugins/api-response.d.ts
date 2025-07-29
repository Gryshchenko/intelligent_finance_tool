import type { ReactotronCore } from "../reactotron-core-client";
/**
 * Sends API request/response information.
 */
declare const apiResponse: () => (reactotron: ReactotronCore) => {
    features: {
        apiResponse: (request: {
            status: number;
        }, response: any, duration: number) => void;
    };
};
export default apiResponse;
