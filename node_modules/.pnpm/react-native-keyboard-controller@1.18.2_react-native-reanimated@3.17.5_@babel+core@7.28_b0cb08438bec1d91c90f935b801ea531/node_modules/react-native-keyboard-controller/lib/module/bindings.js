import { View } from "react-native";
const NOOP = () => {};
export const KeyboardControllerNative = {
  setDefaultMode: NOOP,
  setInputMode: NOOP,
  preload: NOOP,
  dismiss: NOOP,
  setFocusTo: NOOP,
  addListener: NOOP,
  removeListeners: NOOP
};
/**
 * An event emitter that provides a way to subscribe to next keyboard events:
 * - `keyboardWillShow`;
 * - `keyboardDidShow`;
 * - `keyboardWillHide`;
 * - `keyboardDidHide`.
 *
 * Use `addListener` function to add your event listener for a specific keyboard event.
 */
export const KeyboardEvents = {
  addListener: () => ({
    remove: NOOP
  })
};
/**
 * This API is not documented, it's for internal usage only (for now), and is a subject to potential breaking changes in future.
 * Use it with cautious.
 */
export const FocusedInputEvents = {
  addListener: () => ({
    remove: NOOP
  })
};
export const WindowDimensionsEvents = {
  addListener: () => ({
    remove: NOOP
  })
};
/**
 * A view that sends events whenever keyboard or focused events are happening.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-controller-view|Documentation} page for more details.
 */
export const KeyboardControllerView = View;
/**
 * A view that defines a region on the screen, where gestures will control the keyboard position.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-gesture-area|Documentation} page for more details.
 */
export const KeyboardGestureArea = View;
export const RCTOverKeyboardView = View;
/**
 * A view that matches keyboard background.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-background-view|Documentation} page for more details.
 */
export const KeyboardBackgroundView = View;
/**
 * A container that will embed its children into the keyboard
 * and will always show them above the keyboard.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-extender|Documentation} page for more details.
 */
export const RCTKeyboardExtender = View;
//# sourceMappingURL=bindings.js.map