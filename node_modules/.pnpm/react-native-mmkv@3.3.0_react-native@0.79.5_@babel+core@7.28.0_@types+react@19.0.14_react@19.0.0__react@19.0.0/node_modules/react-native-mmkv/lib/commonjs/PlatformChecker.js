"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTest = isTest;
function isTest() {
  if (global.process == null) {
    // In a WebBrowser/Electron the `process` variable does not exist
    return false;
  }
  return process.env.JEST_WORKER_ID != null || process.env.VITEST_WORKER_ID != null;
}
//# sourceMappingURL=PlatformChecker.js.map