"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMMKV = void 0;
var _reactNative = require("react-native");
var _NativeMmkv = require("./NativeMmkv");
var _Types = require("./Types");
var _NativeMmkvPlatformContext = require("./NativeMmkvPlatformContext");
const createMMKV = config => {
  const module = (0, _NativeMmkv.getMMKVTurboModule)();
  if (_reactNative.Platform.OS === 'ios') {
    if (config.path == null) {
      try {
        // If no `path` was supplied, we check if an `AppGroup` was set in Info.plist
        const appGroupDirectory = (0, _NativeMmkvPlatformContext.getMMKVPlatformContextTurboModule)().getAppGroupDirectory();
        if (appGroupDirectory != null) {
          // If we have an `AppGroup` in Info.plist, use that as a path.
          config.path = appGroupDirectory;
        }
      } catch (e) {
        // We cannot throw errors here because it is a sync C++ TurboModule func. idk why.
        console.error(e);
      }
    }
  }
  if (typeof config.mode === 'number') {
    // Code-gen expects enums to be strings. In TS, they might be numbers tho.
    // This sucks, so we need a workaround.
    // @ts-expect-error the native side actually expects a string.
    config.mode = _Types.Mode[config.mode];
  }
  const instance = module.createMMKV(config);
  if (__DEV__) {
    if (typeof instance !== 'object' || instance == null) {
      throw new Error('Failed to create MMKV instance - an unknown object was returned by createMMKV(..)!');
    }
  }
  return instance;
};
exports.createMMKV = createMMKV;
//# sourceMappingURL=createMMKV.js.map