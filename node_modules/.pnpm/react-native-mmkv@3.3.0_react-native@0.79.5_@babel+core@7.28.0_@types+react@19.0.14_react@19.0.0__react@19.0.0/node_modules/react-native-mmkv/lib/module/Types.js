"use strict";

/**
 * IMPORTANT: Some of these types are also in the NativeMmkv.ts file.
 * Due to how react-native-codegen works these are required here as the spec types can not be separated from spec.
 * We also need the types separate to allow bypassing importing turbo module registry in web
 */

/**
 * Configures the mode of the MMKV instance.
 */
export let Mode = /*#__PURE__*/function (Mode) {
  Mode[Mode["SINGLE_PROCESS"] = 0] = "SINGLE_PROCESS";
  Mode[Mode["MULTI_PROCESS"] = 1] = "MULTI_PROCESS";
  return Mode;
}({});

/**
 * Used for configuration of a single MMKV instance.
 */

/**
 * Represents a single MMKV instance.
 */
//# sourceMappingURL=Types.js.map