"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mode = void 0;
exports.getMMKVTurboModule = getMMKVTurboModule;
var _reactNative = require("react-native");
var _ModuleNotFoundError = require("./ModuleNotFoundError");
var _NativeMmkvPlatformContext = require("./NativeMmkvPlatformContext");
/**
 * IMPORTANT: These types are also in the Types.ts file.
 * Due to how react-native-codegen works these are required here as the spec types can not be separated from spec.
 * We also need the types separate to allow bypassing importing turbo module registry in web
 */
/**
 * Configures the mode of the MMKV instance.
 */
let Mode = exports.Mode = /*#__PURE__*/function (Mode) {
  Mode[Mode["SINGLE_PROCESS"] = 0] = "SINGLE_PROCESS";
  Mode[Mode["MULTI_PROCESS"] = 1] = "MULTI_PROCESS";
  return Mode;
}({});
/**
 * Used for configuration of a single MMKV instance.
 */
let mmkvModule;
function getMMKVTurboModule() {
  try {
    if (mmkvModule == null) {
      // 1. Load MMKV TurboModule
      mmkvModule = _reactNative.TurboModuleRegistry.getEnforcing('MmkvCxx');

      // 2. Get the PlatformContext TurboModule as well
      const platformContext = (0, _NativeMmkvPlatformContext.getMMKVPlatformContextTurboModule)();

      // 3. Initialize it with the documents directory from platform-specific context
      const basePath = platformContext.getBaseDirectory();
      mmkvModule.initialize(basePath);
    }
    return mmkvModule;
  } catch (cause) {
    // TurboModule could not be found!
    throw new _ModuleNotFoundError.ModuleNotFoundError(cause);
  }
}
//# sourceMappingURL=NativeMmkv.js.map