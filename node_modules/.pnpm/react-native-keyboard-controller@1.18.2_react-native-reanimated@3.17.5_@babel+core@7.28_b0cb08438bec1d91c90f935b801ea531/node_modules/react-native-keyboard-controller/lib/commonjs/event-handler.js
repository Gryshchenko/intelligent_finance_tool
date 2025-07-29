"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unregisterEventHandler = exports.registerEventHandler = void 0;
let REACore = null;
try {
  REACore = require("react-native-reanimated/src/core");
} catch (e1) {
  try {
    REACore = require("react-native-reanimated/src/reanimated2/core");
  } catch (e2) {
    console.warn("Failed to load REACore from both paths");
  }
}
const registerEventHandler = exports.registerEventHandler = REACore.registerEventHandler;
const unregisterEventHandler = exports.unregisterEventHandler = REACore.unregisterEventHandler;
//# sourceMappingURL=event-handler.js.map