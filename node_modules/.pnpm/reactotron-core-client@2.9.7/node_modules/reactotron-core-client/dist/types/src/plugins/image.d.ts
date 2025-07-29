import type { ReactotronCore } from "../reactotron-core-client";
export interface ImagePayload {
    uri: string;
    preview: string;
    caption?: string;
    width?: number;
    height?: number;
    filename?: string;
}
/**
 * Provides an image.
 */
declare const image: () => (reactotron: ReactotronCore) => {
    features: {
        image: (payload: ImagePayload) => void;
    };
};
export default image;
