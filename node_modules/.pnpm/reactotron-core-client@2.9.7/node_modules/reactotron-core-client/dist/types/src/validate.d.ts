import type { ClientOptions } from "./client-options";
import type { ReactotronCore } from "./reactotron-core-client";
/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 */
declare const validate: (options: ClientOptions<ReactotronCore>) => void;
export default validate;
