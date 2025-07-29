import type { ReactotronCore } from "../reactotron-core-client";
export type AcceptableRepls = object | Function | string | number;
declare const repl: () => (reactotron: ReactotronCore) => {
    onCommand: ({ type, payload }: import("lib/reactotron-core-contract/dist/types/src").Command<import("lib/reactotron-core-contract/dist/types/src").CommandTypeKey, any>) => void;
    features: {
        repl: (name: string, value: AcceptableRepls) => void;
    };
};
export default repl;
