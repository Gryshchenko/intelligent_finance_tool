import { KeyboardControllerNative, KeyboardEvents } from "./bindings";
let isClosed = true;
let lastState = {
  height: 0,
  duration: 0,
  timestamp: new Date().getTime(),
  target: -1,
  type: "default",
  appearance: "light"
};
KeyboardEvents.addListener("keyboardDidHide", e => {
  isClosed = true;
  lastState = e;
});
KeyboardEvents.addListener("keyboardDidShow", e => {
  isClosed = false;
  lastState = e;
});
const dismiss = async options => {
  const keepFocus = (options === null || options === void 0 ? void 0 : options.keepFocus) ?? false;
  return new Promise(resolve => {
    if (isClosed) {
      resolve();
      return;
    }
    const subscription = KeyboardEvents.addListener("keyboardDidHide", () => {
      resolve(undefined);
      subscription.remove();
    });
    KeyboardControllerNative.dismiss(keepFocus);
  });
};
const isVisible = () => !isClosed;
const state = () => lastState;

/**
 * KeyboardController module. Helps to perform imperative actions/checks with keyboard.
 */
export const KeyboardController = {
  setDefaultMode: KeyboardControllerNative.setDefaultMode,
  setInputMode: KeyboardControllerNative.setInputMode,
  setFocusTo: KeyboardControllerNative.setFocusTo,
  preload: KeyboardControllerNative.preload,
  dismiss,
  isVisible,
  state
};
//# sourceMappingURL=module.js.map