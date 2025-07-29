"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMMKVPlatformContextTurboModule = getMMKVPlatformContextTurboModule;
var _reactNative = require("react-native");
var _ModuleNotFoundError = require("./ModuleNotFoundError");
let mmkvPlatformModule;
function getMMKVPlatformContextTurboModule() {
  try {
    if (mmkvPlatformModule == null) {
      // 1. Get the TurboModule
      mmkvPlatformModule = _reactNative.TurboModuleRegistry.getEnforcing('MmkvPlatformContext');
    }
    return mmkvPlatformModule;
  } catch (e) {
    // TurboModule could not be found!
    throw new _ModuleNotFoundError.ModuleNotFoundError(e);
  }
}
//# sourceMappingURL=NativeMmkvPlatformContext.js.map