"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMemoryWarningListener = addMemoryWarningListener;
var _reactNative = require("react-native");
function addMemoryWarningListener(mmkv) {
  if (global.WeakRef != null && global.FinalizationRegistry != null) {
    // 1. Weakify MMKV so we can safely use it inside the memoryWarning event listener
    const weakMmkv = new WeakRef(mmkv);
    const listener = _reactNative.AppState.addEventListener('memoryWarning', () => {
      // 0. Everytime we receive a memoryWarning, we try to trim the MMKV instance (if it is still valid)
      weakMmkv.deref()?.trim();
    });
    // 2. Add a listener to when the MMKV instance is deleted
    const finalization = new FinalizationRegistry(l => {
      // 3. When MMKV is deleted, this listener will be called with the memoryWarning listener.
      l.remove();
    });
    // 2.1. Bind the listener to the actual MMKV instance.
    finalization.register(mmkv, listener);
  } else {
    // WeakRef/FinalizationRegistry is not implemented in this engine.
    // Just add the listener, even if it retains MMKV strong forever.
    _reactNative.AppState.addEventListener('memoryWarning', () => {
      mmkv.trim();
    });
  }
}
//# sourceMappingURL=MemoryWarningListener.js.map