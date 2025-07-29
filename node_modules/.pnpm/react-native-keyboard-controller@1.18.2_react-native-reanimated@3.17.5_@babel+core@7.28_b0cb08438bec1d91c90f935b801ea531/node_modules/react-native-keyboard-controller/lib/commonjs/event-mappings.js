"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyboardEventsMap = exports.focusedInputEventsMap = void 0;
const keyboardEventsMap = exports.keyboardEventsMap = new Map([["onStart", "onKeyboardMoveStart"], ["onMove", "onKeyboardMove"], ["onEnd", "onKeyboardMoveEnd"], ["onInteractive", "onKeyboardMoveInteractive"]]);
const focusedInputEventsMap = exports.focusedInputEventsMap = new Map([["onChangeText", "onFocusedInputTextChanged"], ["onSelectionChange", "onFocusedInputSelectionChanged"]]);
//# sourceMappingURL=event-mappings.js.map